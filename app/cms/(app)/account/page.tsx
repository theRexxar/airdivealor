"use client";

import { useState } from "react";
import { useCmsUser } from "@/components/cms/CmsUser";
import { PageHead } from "@/components/cms/Shell";
import { useToast } from "@/components/cms/Toast";
import { Button, Input } from "@/components/ui";
import { api, ApiError } from "@/lib/cms/client";

export default function AccountPage() {
  const { user } = useCmsUser();
  const toast = useToast();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== again) return setErr("The new passwords don't match.");
    setBusy(true);
    setErr("");
    try {
      await api("/api/cms/auth/password", { body: { current, next } });
      toast("Password changed.");
      setCurrent("");
      setNext("");
      setAgain("");
    } catch (e2) {
      setErr(e2 instanceof ApiError ? e2.message : "Could not change the password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHead title="Your account" sub={`${user.name} · ${user.email} · ${user.roles.join(", ")}`} />
      <div className="cms-card" style={{ maxWidth: 560 }}>
        <div className="cms-card__head"><span className="cms-card__title">Change password</span></div>
        <form className="cms-card__body cms-fields" onSubmit={submit}>
          {err && <div className="cms-banner" role="alert">{err}</div>}
          <Input id="cur" label="Current password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          <Input id="new" label="New password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
          <Input id="new2" label="Repeat the new password" type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} />
          <span className="cms-field__help">At least 10 characters, with a letter and a number.</span>
          <div><Button type="submit" variant="primary" disabled={busy || !current || !next}>Change password</Button></div>
        </form>
      </div>
    </>
  );
}
