import Link from "next/link";
import { getCustomerOverview, getCustomerTickets } from "../../../lib/api";

type Props = {
  params: {
    id: string;
  };
};

export default async function CustomerPage({ params }: Props) {
  const customerId = Number(params.id);
  const overview = await getCustomerOverview(customerId);
  const tickets = await getCustomerTickets(customerId);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/">← Back to dashboard</Link>
      <h1>{overview.name}</h1>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginTop: "1rem" }}>
        <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <h3>Total tickets</h3>
          <p style={{ fontSize: "2rem", margin: 0 }}>{overview.total_tickets}</p>
        </div>
        <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <h3>Open tickets</h3>
          <p style={{ fontSize: "2rem", margin: 0 }}>{overview.open_tickets}</p>
        </div>
        <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <h3>Missing response</h3>
          <p style={{ fontSize: "2rem", margin: 0 }}>{overview.missing_response_count}</p>
        </div>
        <div style={{ padding: "1rem", background: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px" }}>
          <h3>SLA exposure</h3>
          <p style={{ fontSize: "2rem", margin: 0 }}>{overview.sla_exposure_count}</p>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Latest activity</h2>
        {overview.latest_activity.length === 0 ? (
          <p>No timeline events available.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
            {overview.latest_activity.map((event) => (
              <li key={event.id} style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fff" }}>
                <strong>{event.event_type}</strong>
                <p style={{ margin: "0.5rem 0" }}>{event.summary}</p>
                <small>{new Date(event.occurred_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <h2>Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets found for this customer.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "0.75rem" }}>Ticket</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "0.75rem" }}>Status</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "0.75rem" }}>Agent</th>
                <th style={{ textAlign: "left", borderBottom: "1px solid #e5e7eb", padding: "0.75rem" }}>Opened</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.halo_ticket_id} - {ticket.title}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.status || "n/a"}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.agent || "Unassigned"}</td>
                  <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.opened_at || "n/a"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href={`/customers/${customerId}/timeline`} style={{ color: "#1d4ed8" }}>
          View timeline for {overview.name}
        </Link>
      </div>
    </main>
  );
}
