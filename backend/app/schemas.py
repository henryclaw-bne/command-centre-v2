from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel


class TicketRead(BaseModel):
    id: int
    halo_ticket_id: str
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
    description: Optional[str] = None

    class Config:
        orm_mode = True


class TimelineEventRead(BaseModel):
    id: int
    ticket_id: Optional[int]
    event_type: str
    occurred_at: datetime
    summary: str
    details: Optional[str] = None
    source: Optional[str] = None

    class Config:
        orm_mode = True


class CustomerRead(BaseModel):
    id: int
    halo_customer_id: str
    source_customer_name: str
    name: str
    account_owner: Optional[str] = None
    status: Optional[str] = None
    industry: Optional[str] = None
    tickets: List[TicketRead] = []

    class Config:
        orm_mode = True


class CustomerOverview(BaseModel):
    id: int
    name: str
    total_tickets: int
    open_tickets: int
    missing_response_count: int
    sla_exposure_count: int
    latest_activity: List[TimelineEventRead] = []


class StatusCount(BaseModel):
    status: str
    count: int


class GroupCount(BaseModel):
    label: str
    count: int


class OldestTicket(BaseModel):
    id: int
    halo_ticket_id: str
    title: str
    opened_at: Optional[datetime] = None
    status: Optional[str] = None
    customer_name: Optional[str] = None
    agent: Optional[str] = None

    class Config:
        orm_mode = True


class DashboardResponse(BaseModel):
    total_tickets: int
    total_open_tickets: int
    tickets_by_status: List[StatusCount]
    tickets_by_customer: List[GroupCount]
    tickets_by_agent: List[GroupCount]
    oldest_open_tickets: List[OldestTicket]
    missing_response_count: int
    sla_exposure_count: int


class UploadResponse(BaseModel):
    uploaded_filename: str
    rows_processed: int
    rows_imported: int
    rows_skipped: int
    missing_fields_count: int
    invalid_rows: int
    errors: Optional[str] = None
