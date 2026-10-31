"use client";

import { useCallback, useEffect, useState } from "react";
import { useCmsUser } from "@/components/cms/CmsUser";
import { Modal } from "@/components/cms/Modal";
import { PageHead } from "@/components/cms/Shell";
import { useToast } from "@/components/cms/Toast";
import { Button, Icon, Input } from "@/components/ui";
import { api, ApiError } from "@/lib/cms/client";
import { PERMISSIONS } from "@/lib/cms/permissions";
import { Forbidden } from "../Forbidden";

interface Role { id: number; name: string; description: string; isSystem: boolean; permissions: string[]; users: number }

const GROUPS = [...new Set(PERMISSIONS.map((p) => p.group))];

export default function RolesPage() {
  const { can } = useCmsUser();
  const toast = useToast();
  const [roles, setRoles] = useState<Role[] | null>(null);
  const [editing, setEditing] = useState<Role | "new" | null>(null);

  const load = useCallback(async () => {
    try {
      setRoles((await api<{ roles: Role[] }>("/api/cms/roles")).roles);
    } catch (e) {
      toast(e instanceof ApiError ? e.message : "Could not load roles.", true);
    }
  }, [toast]);
  useEffect(() => void load(), [load]);

  if (!can("users.view")) return <Forbidden />;
  const manage = can("roles.manage");

  return (
    <>
      <PageHead
        title="Roles and permissions"
        sub="A role is a set of permissions. Users can have several roles; they get every permission from all of them."
        actions={manage && <Button variant="primary" icon="plus" onClick={() => setEditing("new")}>New role</Button>}
      />
      <div className="cms-card">
        <div className="cms-table__wrap">
          <table className="cms-table">
            <thead><tr><th>Role</th><th>Permissions</th><th>Users</th>{manage && <th />}</tr></thead>
            <tbody>
              {!roles ? (
                <tr><td colSpan={4} className="cms-empty">Loading…</td></tr>
              ) : (
                roles.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <div className="cms-strong">{r.name}{r.isSystem && <span className="cms-pill" style={{ marginLeft: 8 }}>System</span>}</div>
                      <div className="cms-muted">{r.description}</div>
                    </td>
                    <td className="cms-muted">{r.isSystem ? "All permissions" : `${r.permissions.length} of ${PERMISSIONS.length}`}</td>
                    <td>{r.users}</td>
                    {manage && (
                      <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                        <button type="button" className="cms-iconbtn" aria-label={`${r.isSystem ? "View" : "Edit"} ${r.name}`} onClick={() => setEditing(r)}>
                          <Icon name={r.isSystem ? "eye" : "pencil"} size={16} />
                        </button>
                        {!r.isSystem && (
                          <button
                            type="button"
                            className="cms-iconbtn cms-iconbtn--danger"
                            aria-label={`Delete ${r.name}`}
                            onClick={async () => {
                              if (!confirm(`Delete the role “${r.name}”?`)) return;
                              try {
                                await api(`/api/cms/roles/${r.id}`, { method: "DELETE" });
                                toast("Role deleted.");
                                await load();
                              } catch (e) {
                                toast(e instanceof ApiError ? e.message : "Could not delete.", true);
                              }
                            }}
                          >
                            <Icon name="trash-2" size={16} />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {editing && <RoleForm role={editing === "new" ? null : editing} onClose={() => setEditing(null)} onSaved={async () => { setEditing(null); toast("Role saved."); await load(); }} />}
    </>
  );
}

function RoleForm({ role, onClose, onSaved }: { role: Role | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState(role?.name ?? "");
  const [description, setDescription] = useState(role?.description ?? "");
  const [perms, setPerms] = useState<string[]>(role?.permissions ?? ["home.view"]);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const ro = !!role?.isSystem;
  const toggle = (k: string, on: boolean) => setPerms(on ? [...perms, k] : perms.filter((x) => x !== k));

  const submit = async () => {
    setBusy(true);
    setErr("");
    try {
      await api(role ? `/api/cms/roles/${role.id}` : "/api/cms/roles", { method: role ? "PATCH" : "POST", body: { name, description, permissions: perms } });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save.");
      setBusy(false);
    }
  };

  return (
    <Modal
      small
      title={role ? role.name : "New role"}
      onClose={onClose}
      footer={
        ro ? (
          <Button variant="secondary" onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" disabled={busy || !name} onClick={submit}>Save role</Button>
          </>
        )
      }
    >
      {ro && <div className="cms-banner">The Super admin role always has every permission. It can't be edited or deleted.</div>}
      {err && <div className="cms-banner" role="alert">{err}</div>}
      <Input id="r-name" label="Role name" required value={name} disabled={ro} onChange={(e) => setName(e.target.value)} />
      <Input id="r-desc" label="Description" value={description} disabled={ro} onChange={(e) => setDescription(e.target.value)} />
      <div className="cms-perms">
        {GROUPS.map((g) => {
          const items = PERMISSIONS.filter((p) => p.group === g);
          const all = items.every((p) => perms.includes(p.key));
          return (
            <div key={g} className="cms-perms__group">
              <label className="cms-check cms-perms__title">
                <input type="checkbox" disabled={ro} checked={all} onChange={(e) => setPerms(e.target.checked ? [...new Set([...perms, ...items.map((p) => p.key)])] : perms.filter((k) => !items.some((p) => p.key === k)))} />
                {g}
              </label>
              {items.map((p) => (
                <label key={p.key} className="cms-check" style={{ paddingLeft: 26 }}>
                  <input type="checkbox" disabled={ro} checked={perms.includes(p.key)} onChange={(e) => toggle(p.key, e.target.checked)} />
                  {p.label}
                </label>
              ))}
            </div>
          );
        })}
      </div>
    </Modal>
  );
}
