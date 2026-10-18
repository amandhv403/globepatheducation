"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { BookOpenCheck, ExternalLink, Images, LayoutDashboard, LibraryBig, LogOut, Menu, Settings, Users, X } from "lucide-react";
import { Brand } from "@/components/ui";

const navigation = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Lead CRM", icon: Users },
  { href: "/admin/content", label: "Content library", icon: LibraryBig },
  { href: "/admin/settings", label: "Site settings", icon: Settings },
  { href: "/admin/media", label: "Media library", icon: Images },
  { href: "/admin/guide", label: "Guide", icon: BookOpenCheck },
];

export function AdminShell({ email, displayName, children }: { email: string; displayName: string; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const sidebar = <>
    <div className="admin-brand"><Brand /></div>
    <div className="admin-workspace"><small>Workspace</small><strong>Student advisory CRM</strong></div>
    <nav className="admin-nav" aria-label="Admin navigation">
      {navigation.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
        return <Link key={href} href={href} className={active ? "active" : ""} onClick={() => setOpen(false)}><Icon size={18} /><span>{label}</span></Link>;
      })}
    </nav>
    <div className="admin-sidebar-footer">
      <Link href="/" target="_blank">Open website <ExternalLink size={14} /></Link>
      <div><span>{displayName.slice(0, 1).toUpperCase()}</span><p><small>{displayName}</small><strong>{email}</strong></p></div>
      <button onClick={logout} disabled={loggingOut}><LogOut size={16} /> {loggingOut ? "Signing out…" : "Sign out"}</button>
    </div>
  </>;

  return <div className="admin-app">
    <aside className="admin-sidebar">{sidebar}</aside>
    <header className="admin-mobile-header"><Brand /><button onClick={() => setOpen(true)} aria-label="Open admin navigation"><Menu /></button></header>
    <div className={`admin-mobile-drawer ${open ? "open" : ""}`}><button className="admin-drawer-backdrop" onClick={() => setOpen(false)} aria-label="Close navigation"/><aside>{sidebar}<button className="admin-drawer-close" onClick={() => setOpen(false)} aria-label="Close navigation"><X /></button></aside></div>
    <main className="admin-main">{children}</main>
  </div>;
}
