"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { AlertTriangle, LoaderCircle, LockKeyhole } from "lucide-react";

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading"); setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: formData.get("email"), password: formData.get("password") }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setError(body.error || "Unable to sign in."); setStatus("error"); return; }
    router.push("/admin");
    router.refresh();
  }

  if (!configured) return <div className="admin-config-warning"><AlertTriangle size={23}/><h2>Admin credentials need configuration</h2><p>Add these server-side environment variables, then rebuild or restart the application:</p><code>ADMIN_EMAIL</code><code>ADMIN_PASSWORD</code><code>ADMIN_SESSION_SECRET</code><small>The session secret is optional but recommended. It should be a long random value and must never be exposed with a <strong>NEXT_PUBLIC_</strong> prefix.</small></div>;

  return <form className="admin-login-form" onSubmit={submit}>
    <div className="admin-login-icon"><LockKeyhole size={22}/></div>
    <div><label>Email address<input name="email" type="email" autoComplete="username" required autoFocus /></label><label>Password<input name="password" type="password" autoComplete="current-password" required /></label></div>
    {error && <p className="admin-form-error" role="alert">{error}</p>}
    <button disabled={status === "loading"}>{status === "loading" && <LoaderCircle className="spin" size={17}/>} Sign in securely</button>
    <small>Session expires automatically after eight hours.</small>
  </form>;
}
