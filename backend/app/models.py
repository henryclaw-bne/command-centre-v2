from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Mapped, relationship

from sqlalchemy.orm import Mapped
from sqlmodel import Field, Relationship, SQLModel


class Customer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    halo_customer_id: str = Field(index=True)
    source_customer_name: str
    name: str
    account_owner: Optional[str] = None
    status: Optional[str] = None
    industry: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    tickets: Mapped[list["Ticket"]] = Relationship(sa_relationship=relationship("Ticket", back_populates="customer"))


class Ticket(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    halo_ticket_id: str = Field(index=True)
    customer_id: Optional[int] = Field(default=None, foreign_key="customer.id")
    title: str
    status: Optional[str] = None
    priority: Optional[str] = None
    category: Optional[str] = None
    ticket_type: Optional[str] = None
    site: Optional[str] = None
    user_contact: Optional[str] = None
    agent: Optional[str] = None
    response_state: Optional[str] = None
    opened_at: Optional[datetime] = None
    respond_by_at: Optional[datetime] = None
    responded_at: Optional[datetime] = None
    resolution_at: Optional[datetime] = None
    last_updated_at: Optional[datetime] = None
    description: Optional[str] = None
    imported_at: datetime = Field(default_factory=datetime.utcnow)
    customer: Mapped[Optional["Customer"]] = Relationship(sa_relationship=relationship("Customer", back_populates="tickets"))


class TimelineEvent(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    customer_id: int = Field(foreign_key="customer.id")
    ticket_id: Optional[int] = Field(default=None, foreign_key="ticket.id")
    event_type: str
    occurred_at: datetime = Field(default_factory=datetime.utcnow)
    summary: str
    details: Optional[str] = None
    source: Optional[str] = None


class IngestionBatch(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    source_filename: str
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)
    rows_processed: int = 0
    rows_imported: int = 0
    rows_skipped: int = 0
    missing_fields_count: int = 0
    invalid_rows: int = 0
    status: str = Field(default="completed")
    errors: Optional[str] = None
