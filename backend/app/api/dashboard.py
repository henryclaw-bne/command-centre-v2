from collections import Counter
from typing import List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload

from ..db import get_session
from ..models import Customer, Ticket
from ..schemas import DashboardResponse, GroupCount, OldestTicket, StatusCount

router = APIRouter()


OPEN_STATUS_KEYS = {"New", "In Progress", "With User", "On Hold", "Awaiting Approval", "With Vendor"}
SLA_EXPOSURE_STATES = {"Outside", "Awaiting Response", "With User", "With Vendor", "On Hold"}


@router.get("/dashboard", response_model=DashboardResponse)
def get_dashboard(*, session: Session = Depends(get_session)):
    # Load tickets
    tickets = session.exec(select(Ticket)).all()

    # Build customer lookup
    customer_ids = {ticket.customer_id for ticket in tickets if ticket.customer_id}
    customers = session.exec(select(Customer).where(Customer.id.in_(customer_ids))).all()
    customer_lookup = {customer.id: customer for customer in customers}

    status_counts = Counter(ticket.status or "Unknown" for ticket in tickets)
    customer_counts = Counter(
        customer_lookup[ticket.customer_id].name if ticket.customer_id and ticket.customer_id in customer_lookup else "Unknown Customer"
        for ticket in tickets
    )
    agent_counts = Counter(ticket.agent or "Unassigned" for ticket in tickets)

    total_tickets = len(tickets)
    total_open_tickets = sum(1 for ticket in tickets if (ticket.status or "") in OPEN_STATUS_KEYS)
    missing_response_count = sum(1 for ticket in tickets if ticket.responded_at is None)
    sla_exposure_count = sum(1 for ticket in tickets if (ticket.response_state or "") in SLA_EXPOSURE_STATES)

    oldest_open = [
        ticket
        for ticket in tickets
        if ticket.opened_at and (ticket.status or "") in OPEN_STATUS_KEYS
    ]
    oldest_open.sort(key=lambda ticket: ticket.opened_at)
    oldest_open = oldest_open[:10]

    return DashboardResponse(
        total_tickets=total_tickets,
        total_open_tickets=total_open_tickets,
        tickets_by_status=[StatusCount(status=status, count=count) for status, count in status_counts.items()],
        tickets_by_customer=[GroupCount(label=customer, count=count) for customer, count in customer_counts.most_common(10)],
        tickets_by_agent=[GroupCount(label=agent, count=count) for agent, count in agent_counts.most_common(10)],
        oldest_open_tickets=[
            OldestTicket(
                id=ticket.id,
                halo_ticket_id=ticket.halo_ticket_id,
                title=ticket.title,
                opened_at=ticket.opened_at,
                status=ticket.status,
                customer_name=customer_lookup[ticket.customer_id].name if ticket.customer_id and ticket.customer_id in customer_lookup else None,
                agent=ticket.agent,
            )
            for ticket in oldest_open
        ],
        missing_response_count=missing_response_count,
        sla_exposure_count=sla_exposure_count,
    )
