import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technowand Command Centre",
  description: "MVP dashboard for ticket ingestion and operational intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#fafafa" }}>
        {children}
      </body>
    </html>
  );
}
