import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSetupForm } from "@/components/admin/admin-setup-form";
import { hasDatabaseUrl } from "@/db";
import { Brand } from "@/components/ui";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export const metadata: Metadata = { title: "Create Admin Account", robots: { index: false, follow: false } };

export default async function AdminSetupPage() {
  if (!hasDatabaseUrl) return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>Setup required</p><h1>Admin setup is not ready.</h1><span>Creating the first administrator requires the production database connection.</span></div><p role="alert">Please configure DATABASE_URL in the Vercel project settings, then redeploy.</p><a href="/">← Return to public website</a></section></main>;
  let session: Awaited<ReturnType<typeof getAdminSession>> = null;
  let configured = false;
  try {
    session = await getAdminSession();
    configured = await isAdminConfigured();
  } catch (error) {
    console.error("Globepath Education admin setup database check failed", error);
    return (
      <main className="admin-login-page">
        <section className="admin-login-panel">
          <Brand />
          <div className="admin-login-copy">
            <p>Database check</p>
            <h1>Admin setup is temporarily unavailable.</h1>
            <span>The website is available, but the admin database did not respond. Check the connection and required tables, then try again.</span>
          </div>
          <p role="alert">Database status could not be verified.</p>
          <a href="/api/health">Check database status</a>
          <a href="/">← Return to public website</a>
        </section>
      </main>
    );
  }
  if (session) redirect("/admin");
  if (configured) redirect("/admin/login");
  return <main className="admin-login-page"><section className="admin-login-panel"><Brand/><div className="admin-login-copy"><p>One-time owner setup</p><h1>Create your admin.</h1><span>Set the private account that will manage enquiries, counselling stages and internal follow-up notes.</span></div><AdminSetupForm/><a href="/">← Return to public website</a></section><aside className="admin-login-aside setup"><div><p>Private by design</p><h2>Your student enquiries belong in a protected workflow.</h2><ul><li>Hashed passwords</li><li>Expiring database sessions</li><li>Protected CRM routes</li></ul></div></aside></main>;
}
