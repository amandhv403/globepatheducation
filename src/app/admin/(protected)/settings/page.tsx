import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/admin-forms";
import { settingsSchema } from "@/lib/content-fields";
import { ensureSeeded, getSiteSettings } from "@/lib/cms";

export const metadata: Metadata = { title: "Site Settings" };
export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await ensureSeeded();
  const settings = await getSiteSettings();
  return <div className="admin-page admin-editor-page">
    <header className="admin-page-header"><div><p>Global website information</p><h1>Site settings</h1><span>These details appear in the header, footer, contact page, WhatsApp links and search results.</span></div></header>
    <SettingsForm groups={settingsSchema} initialValues={settings as unknown as Record<string, string>} />
  </div>;
}
