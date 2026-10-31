"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Input } from "@/components/ui";
import { api, ApiError } from "@/lib/cms/client";

/** Choose a new password, from a reset email or an invitation. */
function ResetForm() {
  const token = useSearchParams().get("token") ?? "";
  const [info, setInfo] = useState<{ kind: "reset" | "invite"; email: string; name: string } | null>(null);
  const [invalid, setInvalid] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return setInvalid("This link is missing its token.");
    api<{ kind: "reset" | "invite"; email: string; name: string }>(`/api/cms/auth/reset?token=${encodeURIComponent(token)}`)
      .then(setInfo)
      .catch((e) => setInvalid(e instanceof ApiError ? e.message : "This link can't be used."));
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw !== pw2) return setError("The two passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await api("/api/cms/auth/reset", { body: { token, password: pw } });
      window.location.href = "/cms";
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save the password.");
      setBusy(false);
    }
  };

  if (invalid)
    return (
      <>
        <h1 className="cms-auth__title">Link expired</h1>
        <p className="cms-auth__text">{invalid}</p>
        <Link href="/cms/forgot-password">Request a new link</Link>
      </>
    );
  if (!info) return <p className="cms-auth__text">Checking your link…</p>;

  return (
    <>
      <h1 className="cms-auth__title">{info.kind === "invite" ? `Welcome, ${info.name}` : "Choose a new password"}</h1>
      <p className="cms-auth__text">
        {info.kind === "invite" ? "Set a password to activate your account" : "Set a new password"} for <strong>{info.email}</strong>. Use at least 10 characters, with a letter and a number.
      </p>
      <form className="cms-auth__form" onSubmit={submit} noValidate>
        {error && <div role="alert" className="cms-banner">{error}</div>}
        <Input id="pw" label="New password" type="password" autoComplete="new-password" required value={pw} onChange={(e) => setPw(e.target.value)} />
        <Input id="pw2" label="Repeat the password" type="password" autoComplete="new-password" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
        <div className="cms-auth__row">
          <span />
          <Button type="submit" variant="primary" size="large" disabled={busy || !pw || !pw2}>
            {busy ? "Saving…" : info.kind === "invite" ? "Activate account" : "Save password"}
          </Button>
        </div>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="cms-auth__text">Loading…</p>}>
      <ResetForm />
    </Suspense>
  );
}
