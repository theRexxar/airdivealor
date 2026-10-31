"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Input } from "@/components/ui";
import { api, ApiError } from "@/lib/cms/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/cms/auth/forgot", { body: { email } });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (sent)
    return (
      <>
        <h1 className="cms-auth__title">Check your email</h1>
        <Alert type="success" description="The link expires in 1 hour. Check your spam folder if it doesn't arrive in a few minutes.">
          If {email} has an account, we've sent it a link to reset the password.
        </Alert>
        <Link href="/cms/login">Back to sign in</Link>
      </>
    );

  return (
    <>
      <h1 className="cms-auth__title">Forgot your password?</h1>
      <p className="cms-auth__text">Enter the email you sign in with. We'll send you a link to choose a new password.</p>
      <form className="cms-auth__form" onSubmit={submit} noValidate>
        {error && <div role="alert" className="cms-banner">{error}</div>}
        <Input id="email" label="Email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <div className="cms-auth__row">
          <Link href="/cms/login">Back to sign in</Link>
          <Button type="submit" variant="primary" size="large" disabled={busy || !email}>
            {busy ? "Sending…" : "Send reset link"}
          </Button>
        </div>
      </form>
    </>
  );
}
