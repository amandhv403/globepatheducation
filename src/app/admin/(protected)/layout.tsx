import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = { title: { default: "Admin Dashboard", template: "%s | Globepath Admin" }, robots: { index: false, follow: false, nocache: true } };

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return <AdminShell email={session.email} displayName={session.displayName}>{children}</AdminShell>;
}
