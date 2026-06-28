"use client";

// In-portal password change form.
// Unlike the public forgot-password flow, this verifies the current signed-in
// user's password before allowing a new password to be saved.
import { useState } from "react";
import { apiBase } from "@/lib/api-client";

type ChangePasswordPanelProps = { role: "student" | "supervisor" | "coordinator"; compact?: boolean; onSaved?: (message: string) => void };

export function ChangePasswordPanel({ role, compact, onSaved }: ChangePasswordPanelProps) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmPassword = String(form.get("confirmPassword") || "");
    if (newPassword !== confirmPassword) {
      setError("The new passwords do not match.");
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("sip_api_token");
    const response = await fetch(`${apiBase}/auth/change-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await response.json();
    setSaving(false);
    if (!response.ok) {
      setError(result.error || "We could not change your password.");
      return;
    }
    event.currentTarget.reset();
    setMessage(result.message || "Password changed successfully.");
    onSaved?.("Password changed successfully.");
  }

  return <section className={`settings-section-card change-password-card ${compact ? "compact" : ""}`}>
    <header><i>🔑</i><div><h2>Change password</h2><p>Confirm your current password before creating a new one for your {role} portal.</p></div></header>
    <form className="change-password-form" onSubmit={submit}>
      {message && <div className="auth-success">{message}</div>}
      {error && <div className="auth-error">{error}</div>}
      <div className="role-settings-fields">
        <PasswordField label="Current password" name="currentPassword" autoComplete="current-password" placeholder="Enter current password"/>
        <PasswordField label="New password" name="newPassword" autoComplete="new-password" placeholder="Enter new password"/>
        <PasswordField label="Confirm new password" name="confirmPassword" autoComplete="new-password" placeholder="Repeat new password"/>
      </div>
      <div className="change-password-foot"><small>Use at least 8 characters. Avoid reusing your old password.</small><button className="primary" disabled={saving}>{saving ? "Saving..." : "Update password"}</button></div>
    </form>
  </section>;
}

function PasswordField({label,name,autoComplete,placeholder}:{label:string;name:string;autoComplete:string;placeholder:string}) {
  const [visible, setVisible] = useState(false);
  return <label className="password-field"><span>{label}</span><div><input required minLength={8} name={name} type={visible ? "text" : "password"} autoComplete={autoComplete} placeholder={placeholder}/><button type="button" onClick={()=>setVisible(!visible)} aria-label={visible ? `Hide ${label}` : `View ${label}`}>{visible ? "Hide" : "View"}</button></div></label>;
}
