import Link from "next/link";
import { getCustomerTimeline } from "../../../../lib/api";

type Props = {
  params: {
    id: string;
  };
};

export default async function CustomerTimelinePage({ params }: Props) {
  const customerId = Number(params.id);
  const timeline = await getCustomerTimeline(customerId);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <Link href={`/customers/${customerId}`}>← Back to customer</Link>
      <h1>Timeline</h1>
      {timeline.length === 0 ? (
        <p>No timeline events available for this customer.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
          {timeline.map((event) => (
            <li key={event.id} style={{ padding: "1rem", border: "1px solid #e5e7eb", borderRadius: "10px", background: "#fff" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                <strong>{event.event_type}</strong>
                <time>{new Date(event.occurred_at).toLocaleString()}</time>
              </div>
              <p style={{ margin: "0.5rem 0" }}>{event.summary}</p>
              {event.details && <p style={{ margin: 0 }}>{event.details}</p>}
              {event.source && <small>Source: {event.source}</small>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
