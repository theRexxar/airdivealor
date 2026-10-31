import { env } from "./env";

interface Mail {
  to: { email: string; name?: string };
  subject: string;
  html: string;
  text: string;
}

/**
 * Send a transactional email through Brevo (https://api.brevo.com/v3/smtp/email).
 * Without BREVO_API_KEY (local development) the email is printed to the server log instead.
 */
export async function sendMail(mail: Mail): Promise<void> {
  if (!env.BREVO_API_KEY) {
    console.info(`[mail:dev] To: ${mail.to.email}\nSubject: ${mail.subject}\n\n${mail.text}\n`);
    return;
  }
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": env.BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { email: env.MAIL_FROM_EMAIL, name: env.MAIL_FROM_NAME },
      to: [mail.to],
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
    }),
  });
  if (!res.ok) throw new Error(`Brevo error ${res.status}: ${(await res.text()).slice(0, 300)}`);
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Simple branded layout with one call-to-action button. */
export function actionEmail(o: { greeting: string; lines: string[]; button: string; url: string; footer: string }) {
  const html = `<!doctype html><html><body style="margin:0;background:#f8f9fb;font-family:Roboto,Arial,sans-serif;color:#202020">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #e9e9eb;border-radius:8px">
<tr><td style="background:#202020;padding:20px 28px;border-radius:8px 8px 0 0;color:#ffffff;font:600 18px Georgia,serif">Air Dive Alor CMS</td></tr>
<tr><td style="padding:28px">
<p style="margin:0 0 16px;font-size:16px">${esc(o.greeting)}</p>
${o.lines.map((l) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.55;color:#49494a">${esc(l)}</p>`).join("")}
<p style="margin:24px 0"><a href="${esc(o.url)}" style="display:inline-block;background:#2c71f6;color:#ffffff;text-decoration:none;font-weight:600;padding:12px 20px;border-radius:6px">${esc(o.button)}</a></p>
<p style="margin:0;font-size:13px;color:#89898a;line-height:1.5">${esc(o.footer)}<br>${esc(o.url)}</p>
</td></tr></table></td></tr></table></body></html>`;
  const text = [o.greeting, "", ...o.lines, "", `${o.button}: ${o.url}`, "", o.footer].join("\n");
  return { html, text };
}
