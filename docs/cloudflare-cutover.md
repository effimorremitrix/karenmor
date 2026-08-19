# DNS cutover: Render → Cloudflare

Human-executed checklist. Everything here is dashboard/registrar work — none of it is in the repo.

`karenmor.com` is **not** on Cloudflare nameservers yet, so this is a full DNS migration on top of the
hosting move. Keep the two separate: move DNS first with the site still served by Render, confirm
nothing broke, then flip hosting. That way a failure tells you which change caused it, and the site
never goes dark.

> **Highest-severity risk is email, not the website.** `info@karenmor.com` is a live mailbox *and* the
> contact-form notification target. If MX/SPF/DKIM records don't survive the nameserver change,
> Karen's email goes down and the contact flow breaks twice over. Steps 1–2 exist for this.

---

## Phase A — before touching anything

1. At the current DNS provider, **export the full zone file** and save it. This is the rollback artifact.
2. Record what's live right now:
   ```bash
   dig karenmor.com MX +short
   dig karenmor.com TXT +short
   dig karenmor.com A +short
   dig www.karenmor.com CNAME +short
   ```
3. Lower the TTL on the apex and `www` records to 300s. Wait for the old TTL to expire (often 24h)
   before Phase C.

## Phase B — verify the Worker on workers.dev (no DNS change)

4. `npx wrangler d1 create karenmor-contact`, paste the `database_id` into `wrangler.jsonc`, commit.
5. `npx wrangler secret put RESEND_API_KEY`
6. `npm run db:migrate` (applies the migration to the remote D1)
7. `npm run deploy`
8. Against `https://karenmor.<subdomain>.workers.dev`, confirm:
   - `POST /api/contact` with a valid body → `201`, and the JSON is **not** HTML
   - an invalid body → `400` with the Hebrew messages
   - a deep link (`/some/path`) → `200 text/html`
   - the page renders RTL, images and favicon load, the form's success toast appears
   - the row landed:
     ```bash
     npx wrangler d1 execute karenmor-contact --remote \
       --command "SELECT created_at,name,email_status FROM contact_messages ORDER BY created_at DESC LIMIT 5"
     ```
   - `npx wrangler tail` shows no swallowed errors

   Resend can only send from a verified domain, which isn't possible until Phase C. Until then use
   `onboarding@resend.dev` as `CONTACT_FROM_EMAIL` (it only delivers to your own Resend account
   address) — `email_status` will read `sent` and that's enough to prove the path works.

**Do not proceed past here until every check passes.**

## Phase C — move DNS (site still served by Render)

9. Cloudflare dashboard → Add a site → `karenmor.com` → Free plan. Cloudflare scans existing records.
10. **Audit the imported records line by line against the zone file from step 1.** Add anything
    missed by hand, especially every MX and TXT record.
11. Leave the existing Render A/CNAME records exactly as they are, set to **DNS only (grey cloud)**.
12. Change the nameservers at the registrar to the two Cloudflare gave you. Wait for the zone to show
    **Active**.
13. Confirm the site *still serves from Render* and email still flows. Nothing has moved yet.

## Phase D — verify the Resend sending domain

14. In Resend, add `karenmor.com` as a sending domain; add the SPF/DKIM (and DMARC) records it gives
    you in Cloudflare DNS. Wait for **Verified**.
15. Set `CONTACT_FROM_EMAIL` in `wrangler.jsonc` back to `אתר קרן מור <website@karenmor.com>`,
    redeploy, and send one more test submission. Confirm it arrives and Reply-To works.

## Phase E — flip hosting

16. Workers & Pages → `karenmor` → Settings → Domains & Routes → **Add Custom Domain** for
    `karenmor.com`, then again for `www.karenmor.com`.
17. Delete any leftover Render A/CNAME records for apex and `www` (the step above usually replaces
    them — verify).
18. Re-run the step 8 checks against `https://www.karenmor.com` and `https://karenmor.com`.
19. `client/index.html` declares `og:url` as `https://www.karenmor.com`, so add a Cloudflare
    **Redirect Rule**: `karenmor.com/*` → `https://www.karenmor.com/$1`, 301, preserve query string.
20. Add a **WAF rate-limiting rule** on `http.request.uri.path eq "/api/contact"` — e.g. 5 requests
    per 10 minutes per IP, action Block. The endpoint is an unauthenticated public write that now
    costs real email quota and inbox attention.
21. Connect the repo in Settings → Builds (build `npm run build`, deploy
    `npx wrangler deploy -c dist/karenmor/wrangler.json`, branch `main`). Push a trivial commit to
    confirm auto-deploy.
22. Raise TTLs back to normal.
23. **Suspend, don't delete,** the Render service. Delete it after 48–72h of clean operation.

---

## Rollback

| Situation | Action | Recovery |
|---|---|---|
| Site broken after Phase E | Delete the two Worker custom domains, re-add Render's A/CNAME in Cloudflare DNS | ~5 min (TTL 300s) |
| Cloudflare DNS itself is wrong | Point nameservers back at the old provider, restore from the step 1 zone file | NS propagation |
| Code regression only | `npx wrangler rollback` | Instant |

Keep the Render service alive and paid through the whole cutover. Deleting it is the last step, not
the first.
