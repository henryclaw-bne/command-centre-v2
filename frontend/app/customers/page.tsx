import Link from "next/link";
import { getCustomers } from "../../lib/api";

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/">← Back to dashboard</Link>
      <h1>Customers</h1>

      {customers.length === 0 ? (
        <p>No customer data available yet. Upload a CSV to begin.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.75rem", borderBottom: "1px solid #e5e7eb", textAlign: "left" }}>Tickets</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>
                  <Link href={`/customers/${customer.id}`} style={{ color: "#1d4ed8" }}>
                    {customer.name}
                  </Link>
                </td>
                <td style={{ padding: "0.75rem", borderBottom: "1px solid #f3f4f6" }}>{customer.tickets.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
