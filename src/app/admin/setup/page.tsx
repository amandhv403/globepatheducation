import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSetupForm } from "@/components/admin/admin-setup-form";
import { hasDatabaseUrl } from "@/db";
import { Brand } from "@/components/ui";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Create Admin Account", robots: { index: false, follow: false } };

export default async function AdminSetupPage() {
  if (!hasDatabaseUrl) return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>Setup required</p><h1>Admin setup is not ready.</h1><span>Creating the first administrator requires the production database connection.</span></div><p role="alert">Please configure DATABASE_URL in the Vercel project settings, then redeploy.</p><a href="/">← Return to public website</a></section></main>;
  const session = await getAdminSession();
  if (session) redirect("/admin");
  if (await isAdminConfigured()) redirect("/admin/login");
  return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>One-time owner setup</p><h1>Create your admin.</h1><span>Set the private account that will manage enquiries, counselling stages and internal follow-up notes.</span></div><AdminSetupForm/><a href="/">← Return to public website</a></section><aside className="admin-login-aside setup"><div><p>Private by design</p><h2>Your student enquiries belong in a protected workflow.</h2><ul><li>Hashed passwords</li><li>Expiring database sessions</li><li>Protected CRM routes</li></ul></div></aside></main>;
}
