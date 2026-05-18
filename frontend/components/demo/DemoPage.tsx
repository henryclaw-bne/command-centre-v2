"use client";

import { useState } from "react";
import PageHeader from "../PageHeader";
import StatCard from "../StatCard";
import Card from "../Card";
import DataTable from "../DataTable";
import EmptyState from "../EmptyState";
import SlideOver from "../SlideOver";
import ErrorState from "../ErrorState";
import Button from "../forms/Button";

const tableRows = [
  { ticket: "TCK-1201", customer: "Acme Corp", status: "Open", owner: "Sofia" },
  { ticket: "TCK-1198", customer: "Green Labs", status: "Pending", owner: "Amir" },
  { ticket: "TCK-1187", customer: "Nova Systems", status: "Resolved", owner: "Jules" },
];

export default function DemoPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="space-y-8">
      <PageHeader
        title="UI Component Showcase"
        description="A lightweight dashboard preview for the command centre design system."
        secondary={<Button className="bg-neutral-100 text-neutral-900">Secondary</Button>}
        primary={<Button onClick={() => setDrawerOpen(true)}>Open SlideOver</Button>}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total tickets" metric="1,280" delta="+12% from last month" />
        <StatCard title="Open issues" metric="84" delta="-3%" />
        <StatCard title="SLA risks" metric="14" delta="+8%" />
        <StatCard title="Customer NPS" metric="92" delta="+2 pts" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card title="Recent tickets">
          <DataTable
            title="Ticket activity"
            header={(
              <tr>
                <th className="px-4 py-3">Ticket</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Owner</th>
              </tr>
            )}
          >
            {tableRows.map((row) => (
              <tr key={row.ticket} className="border-b last:border-b-0">
                <td className="px-4 py-3">{row.ticket}</td>
                <td className="px-4 py-3">{row.customer}</td>
                <td className="px-4 py-3">{row.status}</td>
                <td className="px-4 py-3">{row.owner}</td>
              </tr>
            ))}
          </DataTable>
        </Card>

        <div className="space-y-4">
          <Card title="Empty state demo">
            <EmptyState
              title="No items found"
              description="There is nothing to display yet. Use a search or create a new item to get started."
              action={<Button onClick={() => setDrawerOpen(true)}>Open drawer</Button>}
            />
          </Card>
          <Card title="Error state demo">
            <ErrorState message="Unable to load the latest metrics. Please try again." onRetry={() => window.location.reload()} />
          </Card>
        </div>
      </div>

      <SlideOver open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <div className="space-y-4">
          <div className="text-lg font-semibold">SlideOver panel</div>
          <p className="text-sm text-neutral-600">This panel demonstrates a reusable drawer layout with scrollable content and responsive spacing.</p>
          <div className="space-y-3">
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-sm font-semibold">Detail item</div>
              <p className="text-sm text-neutral-600">Use this pattern for ticket details, customer profiles, or AI conversations.</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-4">
              <div className="text-sm font-semibold">Action area</div>
              <Button onClick={() => setDrawerOpen(false)}>Close panel</Button>
            </div>
          </div>
        </div>
      </SlideOver>
    </div>
  );
}
