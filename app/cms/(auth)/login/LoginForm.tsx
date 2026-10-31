"use client";

import Link from "next/link";
import { useState } from "react";
import { Alert, Button, Input } from "@/components/ui";
import { api, ApiError } from "@/lib/cms/client";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/api/cms/auth/login", { body: { email, password } });
      window.location.href = next;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in.");
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="cms-auth__title">Sign in</h1>
      <form className="cms-auth__form" onSubmit={submit} noValidate>
        {error && <div role="alert" className="cms-banner" style={{ background: "var(--red-050)", borderColor: "var(--red-200)", color: "var(--red-800)" }}>{error}</div>}
        <Input id="email" label="Email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input id="password" label="Password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="cms-auth__row">
          <Link href="/cms/forgot-password">Forgot password?</Link>
          <Button type="submit" variant="primary" size="large" disabled={busy || !email || !password}>
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </div>
      </form>
      <Alert>Only Air Dive Alor team members can sign in. Ask an administrator for an invitation.</Alert>
    </>
  );
}
