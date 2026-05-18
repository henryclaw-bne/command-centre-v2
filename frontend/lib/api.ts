export type Ticket = {
  id: number;
  halo_ticket_id: string;
  title: string;
  status?: string;
  priority?: string;
  category?: string;
  ticket_type?: string;
  site?: string;
  user_contact?: string;
  agent?: string;
  response_state?: string;
  opened_at?: string;
  respond_by_at?: string;
  responded_at?: string;
  resolution_at?: string;
  description?: string;
};

export type Customer = {
  id: number;
  halo_customer_id: string;
  source_customer_name: string;
  name: string;
  account_owner?: string;
  status?: string;
  industry?: string;
  tickets: Ticket[];
};

export type TimelineEvent = {
  id: number;
  ticket_id?: number;
  event_type: string;
  occurred_at: string;
  summary: string;
  details?: string;
  source?: string;
};

export type DashboardSummary = {
  total_tickets: number;
  total_open_tickets: number;
  tickets_by_status: { status: string; count: number }[];
  tickets_by_customer: { label: string; count: number }[];
  tickets_by_agent: { label: string; count: number }[];
  oldest_open_tickets: {
    id: number;
    halo_ticket_id: string;
    title: string;
    opened_at?: string;
    status?: string;
    customer_name?: string;
    agent?: string;
  }[];
  missing_response_count: number;
  sla_exposure_count: number;
};

export type UploadResponse = {
  uploaded_filename: string;
  rows_processed: number;
  rows_imported: number;
  rows_skipped: number;
  missing_fields_count: number;
  invalid_rows: number;
  errors?: string;
};

export type CustomerOverview = {
  id: number;
  name: string;
  total_tickets: number;
  open_tickets: number;
  missing_response_count: number;
  sla_exposure_count: number;
  latest_activity: TimelineEvent[];
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:8000" : "");

if (!BACKEND_URL) {
  throw new Error("NEXT_PUBLIC_BACKEND_URL must be configured for production deployment.");
}

export async function getCustomers(): Promise<Customer[]> {
  const response = await fetch(`${BACKEND_URL}/api/customers`, { cache: "no-store" });
  if (!response.ok) {
    return [];
  }
  return response.json();
}

export async function getDashboard(): Promise<DashboardSummary> {
  const response = await fetch(`${BACKEND_URL}/api/dashboard`, { cache: "no-store" });
  if (!response.ok) {
    return {
      total_tickets: 0,
      total_open_tickets: 0,
      tickets_by_status: [],
      tickets_by_customer: [],
      tickets_by_agent: [],
      oldest_open_tickets: [],
      missing_response_count: 0,
      sla_exposure_count: 0,
    };
  }

  try {
    return await response.json();
  } catch {
    return {
      total_tickets: 0,
      total_open_tickets: 0,
      tickets_by_status: [],
      tickets_by_customer: [],
      tickets_by_agent: [],
      oldest_open_tickets: [],
      missing_response_count: 0,
      sla_exposure_count: 0,
    };
  }
}

export async function getCustomerOverview(customerId: number): Promise<CustomerOverview> {
  const response = await fetch(`${BACKEND_URL}/api/customers/${customerId}/overview`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Failed to load customer overview");
  }
  return response.json();
}

export async function getCustomerTickets(customerId: number): Promise<Ticket[]> {
  const response = await fetch(`${BACKEND_URL}/api/customers/${customerId}/tickets`, { cache: "no-store" });
  return response.json();
}

export async function getCustomerTimeline(customerId: number): Promise<TimelineEvent[]> {
  const response = await fetch(`${BACKEND_URL}/api/customers/${customerId}/timeline`, { cache: "no-store" });
  return response.json();
}

export async function uploadCsv(file: File): Promise<UploadResponse> {
  const data = new FormData();
  data.append("file", file);

  const response = await fetch(`${BACKEND_URL}/api/upload-csv`, {
    method: "POST",
    body: data,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
