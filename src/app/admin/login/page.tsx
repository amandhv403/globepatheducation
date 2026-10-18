import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { Brand } from "@/components/ui";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");
  const configured = await isAdminConfigured();
  if (!configured) redirect("/admin/setup");
  return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>Protected workspace</p><h1>Welcome back.</h1><span>Sign in to review student enquiries, update counselling stages and manage follow-up context.</span></div><AdminLoginForm configured={configured}/><a href="/">← Return to public website</a></section><aside className="admin-login-aside"><div><p>Globepath administration</p><h2>Guidance becomes stronger when every enquiry has context.</h2><ul><li>Review consultation and assessment details</li><li>Track each student through the advisory pipeline</li><li>Keep private notes for clear follow-up</li></ul></div></aside></main>;
}
