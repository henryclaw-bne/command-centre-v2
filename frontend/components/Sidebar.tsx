"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

function NavItem({ icon, label, href }: NavItemProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm ${
        active ? "bg-neutral-800 text-white" : "text-neutral-200 hover:bg-neutral-700"
      }`}
    >
      <span className="w-5 h-5">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar({
  collapsed = false,
  mobileOpen = false,
  onToggle,
  onCloseMobile,
}: {
  collapsed?: boolean;
  mobileOpen?: boolean;
  onToggle?: () => void;
  onCloseMobile?: () => void;
}) {
  const content = (
    <div className="h-full bg-neutral-900 text-neutral-100 flex flex-col">
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-800 rounded-md w-10 h-10 flex items-center justify-center font-bold">CC</div>
          {!collapsed && <span className="font-semibold">Command Centre</span>}
        </div>
        <button onClick={onToggle} aria-label="Toggle sidebar" className="text-neutral-300 hover:text-white">
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      <nav className="px-2 py-4 space-y-1 flex-1">
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M3 13h8V3H3v10zM3 21h8v-6H3v6zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" fill="currentColor"/></svg>} label="Dashboard" href="/" />
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/></svg>} label="UI Demo" href="/demo" />
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M3 6h18" stroke="currentColor" strokeWidth="1.5"/></svg>} label="Tickets" href="/tickets" />
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/></svg>} label="Customers" href="/customers" />
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 3v18" stroke="currentColor" strokeWidth="1.5"/></svg>} label="Reports" href="/reports" />
        <NavItem icon={<svg viewBox="0 0 24 24" fill="none" className="w-5 h-5"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" stroke="currentColor" strokeWidth="1"/></svg>} label="Settings" href="/settings" />
      </nav>

      <div className="px-3 py-4 border-t border-neutral-800">
        <button className="w-full text-left px-3 py-2 rounded-md text-sm text-neutral-200 hover:bg-neutral-700">Upgrade</button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`hidden md:flex flex-shrink-0 h-screen transition-all ${collapsed ? "w-16" : "w-64"}`}>
        {content}
      </aside>
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <div className="relative w-72 h-full shadow-xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
