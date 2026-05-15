from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from ..db import get_session
from ..models import Customer, Ticket, TimelineEvent
from ..schemas import CustomerOverview, CustomerRead, TicketRead, TimelineEventRead

router = APIRouter()


@router.get("/customers", response_model=List[CustomerRead])
def list_customers(*, session: Session = Depends(get_session)):
    statement = select(Customer).options(selectinload(Customer.tickets)).order_by(Customer.name)
    customers = session.exec(statement).all()
    return customers


@router.get("/customers/{customer_id}", response_model=CustomerRead)
def get_customer(*, customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer


@router.get("/customers/{customer_id}/tickets", response_model=List[TicketRead])
def get_customer_tickets(*, customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    tickets = session.exec(select(Ticket).where(Ticket.customer_id == customer_id).order_by(Ticket.opened_at)).all()
    return tickets


@router.get("/customers/{customer_id}/timeline", response_model=List[TimelineEventRead])
def get_customer_timeline(*, customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    events = session.exec(
        select(TimelineEvent).where(TimelineEvent.customer_id == customer_id).order_by(TimelineEvent.occurred_at.desc())
    ).all()
    return events


@router.get("/customers/{customer_id}/overview", response_model=CustomerOverview)
def get_customer_overview(*, customer_id: int, session: Session = Depends(get_session)):
    customer = session.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    tickets = session.exec(select(Ticket).where(Ticket.customer_id == customer_id)).all()
    events = session.exec(
        select(TimelineEvent)
        .where(TimelineEvent.customer_id == customer_id)
        .order_by(TimelineEvent.occurred_at.desc())
        .limit(5)
    ).all()

    open_statuses = {"New", "In Progress", "With User", "On Hold", "Awaiting Approval", "With Vendor"}
    sla_states = {"Outside", "Awaiting Response", "With User", "With Vendor", "On Hold"}

    return CustomerOverview(
        id=customer.id,
        name=customer.name,
        total_tickets=len(tickets),
        open_tickets=sum(1 for ticket in tickets if (ticket.status or "") in open_statuses),
        missing_response_count=sum(1 for ticket in tickets if ticket.responded_at is None),
        sla_exposure_count=sum(1 for ticket in tickets if (ticket.response_state or "") in sla_states),
        latest_activity=events,
    )
