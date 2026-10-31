import { and, eq, gt, isNull } from "drizzle-orm";
import { db, schema } from "./db";
import { env } from "./env";
import { hashToken, newToken } from "./auth";
import { actionEmail, sendMail } from "./mail";

const TTL = { reset: 60 * 60 * 1000, invite: 7 * 24 * 60 * 60 * 1000 };

/** Create a one-time link (password reset or invitation) and email it through Brevo. */
export async function sendPasswordLink(user: { id: number; email: string; name: string }, kind: "reset" | "invite", invitedBy?: string) {
  const token = newToken();
  await db.insert(schema.passwordTokens).values({ userId: user.id, tokenHash: hashToken(token), kind, expiresAt: new Date(Date.now() + TTL[kind]) });
  const url = `${env.SITE_URL.replace(/\/$/, "")}/cms/reset-password?token=${encodeURIComponent(token)}`;
  const mail =
    kind === "reset"
      ? actionEmail({
          greeting: `Hi ${user.name},`,
          lines: ["We received a request to reset the password for your Air Dive Alor CMS account.", "This link works once and expires in 1 hour."],
          button: "Choose a new password",
          url,
          footer: "If you didn't ask for this, you can ignore this email. Your password stays the same.",
        })
      : actionEmail({
          greeting: `Hi ${user.name},`,
          lines: [`${invitedBy ?? "An administrator"} invited you to the Air Dive Alor CMS.`, "Set your password to activate your account. The link expires in 7 days."],
          button: "Set your password",
          url,
          footer: "If you weren't expecting this invitation, you can ignore this email.",
        });
  await sendMail({ to: { email: user.email, name: user.name }, subject: kind === "reset" ? "Reset your Air Dive Alor CMS password" : "You're invited to the Air Dive Alor CMS", ...mail });
}

/** Find a valid, unused token. */
export async function findToken(token: string) {
  return db.query.passwordTokens.findFirst({
    where: and(eq(schema.passwordTokens.tokenHash, hashToken(token)), isNull(schema.passwordTokens.usedAt), gt(schema.passwordTokens.expiresAt, new Date())),
  });
}
