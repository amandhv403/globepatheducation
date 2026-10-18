"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, ShieldCheck } from "lucide-react";

export function AdminSetupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle"|"loading"|"error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading"); setError("");
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); setStatus("idle"); return; }
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirmation = String(data.get("confirmation") || "");
    if (password !== confirmation) { setError("The password confirmation does not match."); setStatus("error"); return; }
    const response = await fetch("/api/admin/setup", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ displayName:data.get("displayName"), email:data.get("email"), password }) });
    const body = await response.json().catch(()=>({}));
    if (!response.ok) { setError(body.error || "Unable to create the administrator."); setStatus("error"); return; }
    router.push("/admin"); router.refresh();
  }

  return <form className="admin-login-form admin-setup-form" onSubmit={submit}>
    <div className="admin-login-icon"><ShieldCheck size={22}/></div>
    <div className="admin-setup-note"><Check size={14}/><span>This setup closes after the first administrator is created.</span></div>
    <label>Administrator name<input name="displayName" autoComplete="name" required minLength={2} autoFocus/></label>
    <label>Email address<input name="email" type="email" autoComplete="email" required/></label>
    <label>Password<input name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={200}/><small>Use at least 10 characters.</small></label>
    <label>Confirm password<input name="confirmation" type="password" autoComplete="new-password" required minLength={10}/></label>
    {error&&<p className="admin-form-error" role="alert">{error}</p>}
    <button disabled={status==="loading"}>{status==="loading"&&<LoaderCircle className="spin" size={17}/>} Create secure admin</button>
    <small>The password is salted and hashed before storage.</small>
  </form>;
}
