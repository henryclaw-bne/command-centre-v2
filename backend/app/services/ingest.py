import csv
from datetime import datetime
from io import TextIOWrapper
from typing import Dict, List, Optional

from sqlmodel import Session, select

from ..models import Customer, IngestionBatch, Ticket, TimelineEvent

REQUIRED_COLUMNS = [
    "Ticket ID",
    "Subject",
    "Customer",
    "Status",
    "Date Opened",
]

SLA_EXPOSURE_STATES = {"Outside", "Awaiting Response", "With User", "With Vendor", "On Hold"}


def _normalize_string(value: Optional[str]) -> Optional[str]:
    if value is None:
        return None
    normalized = " ".join(value.strip().split())
    return normalized if normalized else None


def _parse_datetime(value: Optional[str]) -> Optional[datetime]:
    if not value:
        return None
    value = value.strip()
    if not value:
        return None
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d", "%d/%m/%Y", "%m/%d/%Y"):
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            continue
    return None


def _create_timeline_events(session: Session, ticket: Ticket, row: Dict[str, str]) -> None:
    opened_at = ticket.opened_at or datetime.utcnow()
    events: List[TimelineEvent] = []

    events.append(
        TimelineEvent(
            customer_id=ticket.customer_id,
            ticket_id=ticket.id,
            event_type="ticket_opened",
            occurred_at=opened_at,
            summary=f"Ticket opened: {ticket.halo_ticket_id}",
            details=ticket.title,
            source="csv_upload",
        )
    )

    if ticket.respond_by_at:
        events.append(
            TimelineEvent(
                customer_id=ticket.customer_id,
                ticket_id=ticket.id,
                event_type="sla_target",
                occurred_at=ticket.respond_by_at,
                summary=f"Respond by target: {ticket.respond_by_at.isoformat()}",
                details=ticket.response_state,
                source="csv_upload",
            )
        )

    if ticket.responded_at:
        events.append(
            TimelineEvent(
                customer_id=ticket.customer_id,
                ticket_id=ticket.id,
                event_type="first_response",
                occurred_at=ticket.responded_at,
                summary=f"Ticket first responded",
                details=ticket.agent,
                source="csv_upload",
            )
        )

    if ticket.resolution_at:
        events.append(
            TimelineEvent(
                customer_id=ticket.customer_id,
                ticket_id=ticket.id,
                event_type="ticket_resolution",
                occurred_at=ticket.resolution_at,
                summary=f"Resolution scheduled/completed",
                details=ticket.status,
                source="csv_upload",
            )
        )

    if ticket.response_state in SLA_EXPOSURE_STATES:
        events.append(
            TimelineEvent(
                customer_id=ticket.customer_id,
                ticket_id=ticket.id,
                event_type="sla_exposure",
                occurred_at=ticket.respond_by_at or datetime.utcnow(),
                summary=f"SLA exposure: {ticket.response_state}",
                details=ticket.status,
                source="csv_upload",
            )
        )

    session.add_all(events)
    session.commit()


def process_ticket_csv(session: Session, filename: str, file_stream) -> Dict[str, object]:
    reader = csv.DictReader(TextIOWrapper(file_stream, encoding="utf-8"))
    if reader.fieldnames is None:
        raise ValueError("CSV file is missing a header row")

    missing_columns = [col for col in REQUIRED_COLUMNS if col not in reader.fieldnames]
    if missing_columns:
        raise ValueError(f"CSV missing required columns: {', '.join(missing_columns)}")

    batch = IngestionBatch(source_filename=filename, rows_processed=0, rows_imported=0, rows_skipped=0, missing_fields_count=0, invalid_rows=0)
    session.add(batch)
    session.commit()
    session.refresh(batch)

    row_number = 0
    errors: List[str] = []

    for raw_row in reader:
        row_number += 1
        batch.rows_processed += 1
        row = {key: _normalize_string(value) for key, value in raw_row.items()}

        required_missing = [col for col in REQUIRED_COLUMNS if not row.get(col)]
        if required_missing:
            batch.missing_fields_count += 1
            batch.rows_skipped += 1
            errors.append(f"Row {row_number}: missing required fields {required_missing}")
            continue

        ticket_id = row["Ticket ID"]
        customer_name = row["Customer"]
        normalized_customer_id = customer_name.lower().strip()

        customer = session.exec(select(Customer).where(Customer.halo_customer_id == normalized_customer_id)).first()
        if not customer:
            customer = Customer(
                halo_customer_id=normalized_customer_id,
                source_customer_name=customer_name,
                name=customer_name,
            )
            session.add(customer)
            session.commit()
            session.refresh(customer)

        ticket = session.exec(select(Ticket).where(Ticket.halo_ticket_id == ticket_id)).first()
        opened_at = _parse_datetime(row.get("Date Opened"))
        respond_by_at = _parse_datetime(row.get("Respond by Date"))
        responded_at = _parse_datetime(row.get("Responded Date"))
        resolution_at = _parse_datetime(row.get("Resolution Date"))

        try:
            if ticket:
                ticket.customer_id = customer.id
                ticket.title = row.get("Subject") or ticket.title
                ticket.status = row.get("Status") or ticket.status
                ticket.priority = row.get("Category") or ticket.priority
                ticket.category = row.get("Category") or ticket.category
                ticket.ticket_type = row.get("Ticket Type") or ticket.ticket_type
                ticket.site = row.get("Site") or ticket.site
                ticket.user_contact = row.get("User") or ticket.user_contact
                ticket.agent = row.get("Agent") or ticket.agent
                ticket.response_state = row.get("Response State") or ticket.response_state
                ticket.opened_at = opened_at or ticket.opened_at
                ticket.respond_by_at = respond_by_at or ticket.respond_by_at
                ticket.responded_at = responded_at or ticket.responded_at
                ticket.resolution_at = resolution_at or ticket.resolution_at
                ticket.last_updated_at = datetime.utcnow()
                ticket.description = row.get("Subject") or ticket.description
                session.add(ticket)
                session.commit()
            else:
                ticket = Ticket(
                    halo_ticket_id=ticket_id,
                    customer_id=customer.id,
                    title=row.get("Subject") or "",
                    status=row.get("Status"),
                    priority=row.get("Category"),
                    category=row.get("Category"),
                    ticket_type=row.get("Ticket Type"),
                    site=row.get("Site"),
                    user_contact=row.get("User"),
                    agent=row.get("Agent"),
                    response_state=row.get("Response State"),
                    opened_at=opened_at,
                    respond_by_at=respond_by_at,
                    responded_at=responded_at,
                    resolution_at=resolution_at,
                    last_updated_at=datetime.utcnow(),
                    description=row.get("Subject"),
                )
                session.add(ticket)
                session.commit()
                session.refresh(ticket)
                _create_timeline_events(session, ticket, row)

            batch.rows_imported += 1
        except Exception as exc:  # pragma: no cover
            batch.invalid_rows += 1
            batch.rows_skipped += 1
            errors.append(f"Row {row_number}: {exc}")
            continue

    batch.status = "completed"
    batch.errors = "\n".join(errors) if errors else None
    session.add(batch)
    session.commit()

    return {
        "uploaded_filename": filename,
        "rows_processed": batch.rows_processed,
        "rows_imported": batch.rows_imported,
        "rows_skipped": batch.rows_skipped,
        "missing_fields_count": batch.missing_fields_count,
        "invalid_rows": batch.invalid_rows,
        "errors": batch.errors,
    }
