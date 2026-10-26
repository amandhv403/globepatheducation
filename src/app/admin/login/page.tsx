import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { hasDatabaseUrl } from "@/db";
import { Brand } from "@/components/ui";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Admin Sign In", robots: { index: false, follow: false } };

export default async function AdminLoginPage() {
  if (!hasDatabaseUrl) return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>Setup required</p><h1>Admin is not connected yet.</h1><span>The website can load, but admin sign-in needs the production database connection configured in Vercel.</span></div><p role="alert">Please configure DATABASE_URL in the Vercel project settings, then redeploy.</p><a href="/">← Return to public website</a></section></main>;
  let session: Awaited<ReturnType<typeof getAdminSession>> = null;
  let configured = false;
  try {
    session = await getAdminSession();
    configured = await isAdminConfigured();
  } catch (error) {
    console.error("Globepath Education admin login database check failed", error);
    return (
      <main className="admin-login-page">
        <section className="admin-login-panel">
          <Brand />
          <div className="admin-login-copy">
            <p>Database check</p>
            <h1>Admin is temporarily unavailable.</h1>
            <span>The public website is available, but the admin database did not respond. Check its connection and required tables, then try again.</span>
          </div>
          <p role="alert">Database status could not be verified.</p>
          <a href="/api/health">Check database status</a>
          <a href="/">← Return to public website</a>
        </section>
      </main>
    );
  }
  if (session) redirect("/admin");
  if (!configured) redirect("/admin/setup");
  return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>Protected workspace</p><h1>Welcome back.</h1><span>Sign in to review student enquiries, update counselling stages and manage follow-up context.</span></div><AdminLoginForm configured={configured}/><a href="/">← Return to public website</a></section><aside className="admin-login-aside"><div><p>Globepath administration</p><h2>Guidance becomes stronger when every enquiry has context.</h2><ul><li>Review consultation and assessment details</li><li>Track each student through the advisory pipeline</li><li>Keep private notes for clear follow-up</li></ul></div></aside></main>;
}
