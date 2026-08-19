import type { ContactMessage } from "@shared/schema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const PREFERRED_CONTACT_LABELS: Record<string, string> = {
  phone: "טלפון",
  email: "אימייל",
  whatsapp: "וואטסאפ",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(message: ContactMessage): string {
  const preferred =
    PREFERRED_CONTACT_LABELS[message.preferredContact] ??
    message.preferredContact;

  const rows = [
    ["שם", message.name],
    ["טלפון", message.phone],
    ["אימייל", message.email],
    ["דרך יצירת קשר מועדפת", preferred],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 0;font-weight:600;">${escapeHtml(label)}</td>` +
        `<td style="padding:4px 12px;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return `<div dir="rtl" lang="he" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#2b2320;">
  <h2 style="margin:0 0 16px;">פנייה חדשה מהאתר</h2>
  <table style="border-collapse:collapse;">${rows}</table>
  <h3 style="margin:24px 0 8px;">ההודעה</h3>
  <p style="white-space:pre-wrap;margin:0;">${escapeHtml(message.message)}</p>
  <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
  <p style="font-size:12px;color:#888;margin:0;">התקבלה ב-${escapeHtml(message.createdAt)} · מזהה ${escapeHtml(message.id)}</p>
</div>`;
}

function renderText(message: ContactMessage): string {
  const preferred =
    PREFERRED_CONTACT_LABELS[message.preferredContact] ??
    message.preferredContact;

  return [
    "פנייה חדשה מהאתר",
    "",
    `שם: ${message.name}`,
    `טלפון: ${message.phone}`,
    `אימייל: ${message.email}`,
    `דרך יצירת קשר מועדפת: ${preferred}`,
    "",
    "ההודעה:",
    message.message,
    "",
    `התקבלה ב-${message.createdAt} · מזהה ${message.id}`,
  ].join("\n");
}

/**
 * Sends the notification to Karen. Throws on failure so the caller can record
 * the reason in `email_status` — it deliberately does not swallow errors.
 *
 * Uses the Resend REST API directly rather than the `resend` npm SDK: one call,
 * one fewer dependency, and no Node-shim surface in workerd.
 */
export async function sendContactNotification(
  env: Env,
  message: ContactMessage,
): Promise<void> {
  if (env.EMAIL_DRY_RUN === "1") {
    console.log(
      `[contact] EMAIL_DRY_RUN — would notify about ${message.id}:`,
      renderText(message),
    );
    return;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: message.email,
      subject: `פנייה חדשה מהאתר — ${message.name}`,
      html: renderHtml(message),
      text: renderText(message),
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
  }
}
