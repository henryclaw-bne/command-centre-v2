import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Technowand Command Centre",
  description: "MVP dashboard for ticket ingestion and operational intelligence.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
