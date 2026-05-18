import UploadForm from "./components/UploadForm";
import { getDashboard } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dashboard = await getDashboard();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Technowand Command Centre</h1>
      <p>Read-only MVP for ticket ingestion and operational intelligence.</p>

      <UploadForm />

      <section style={{ marginTop: "2rem" }}>
        <h2>Operational Metrics</h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <div style={{ padding: "1rem", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <h3>Total tickets</h3>
            <p style={{ fontSize: "2rem", margin: 0 }}>{dashboard.total_tickets}</p>
          </div>
          <div style={{ padding: "1rem", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <h3>Open tickets</h3>
            <p style={{ fontSize: "2rem", margin: 0 }}>{dashboard.total_open_tickets}</p>
          </div>
          <div style={{ padding: "1rem", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <h3>Missing response</h3>
            <p style={{ fontSize: "2rem", margin: 0 }}>{dashboard.missing_response_count}</p>
          </div>
          <div style={{ padding: "1rem", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
            <h3>SLA exposure</h3>
            <p style={{ fontSize: "2rem", margin: 0 }}>{dashboard.sla_exposure_count}</p>
          </div>
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Tickets by status</h2>
        <div style={{ display: "grid", gap: "0.75rem", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          {dashboard.tickets_by_status.map((item) => (
            <div key={item.status} style={{ padding: "1rem", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
              <strong>{item.status}</strong>
              <p style={{ fontSize: "1.5rem", margin: 0 }}>{item.count}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Top customers</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
          {dashboard.tickets_by_customer.map((item) => (
            <li key={item.label} style={{ padding: "1rem", background: "#fff", borderRadius: "10px", border: "1px solid #e5e7eb" }}>
              <strong>{item.label}</strong>
              <div>{item.count} tickets</div>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Oldest open tickets</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>Ticket</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>Customer</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>Opened</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>Agent</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.oldest_open_tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.halo_ticket_id} - {ticket.title}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.customer_name || "Unknown"}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.opened_at || "n/a"}</td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{ticket.agent || "Unassigned"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
