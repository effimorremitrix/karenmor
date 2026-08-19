# קרן מור — Karen Mor

Professional website for Karen Mor, a child and educational psychologist based in Netanya, Israel.
Hebrew (RTL), written in first person, warm and professional design.

Live at **https://www.karenmor.com**

---

## Architecture

A single Cloudflare Worker serves both the site and its one API route.

```
request → Cloudflare edge
  ├─ /api/*   → Worker (worker/index.ts) → D1 → Resend notification
  └─ anything → static assets from dist/client, SPA fallback to index.html
```

| Layer | Stack |
|---|---|
| Frontend | React 18 + TypeScript, Vite 7, Wouter, TanStack Query, Tailwind 3 + shadcn/ui, framer-motion |
| Backend | Cloudflare Worker (plain `fetch` handler — no framework) |
| Database | Cloudflare D1 (SQLite), accessed with `drizzle-orm/d1` |
| Email | Resend REST API |
| Hosting | Cloudflare Workers with Static Assets |
| Deploys | Cloudflare Workers Builds (auto-deploy on push to `main`) |

### Layout

| Path | Purpose |
|---|---|
| `client/src/pages/home.tsx` | The entire landing page |
| `client/src/index.css` | Colour scheme (warm teal primary, orange accent) |
| `worker/index.ts` | Worker entry — routing only |
| `worker/contact.ts` | `POST /api/contact` — validate, store, notify |
| `worker/email.ts` | Resend notification rendering and send |
| `shared/schema.ts` | Drizzle table + Zod validation (Hebrew messages) |
| `migrations/` | D1 schema migrations (hand-written SQL) |
| `wrangler.jsonc` | Worker configuration |

### `POST /api/contact`

| Outcome | Response |
|---|---|
| Valid | `201 {"message":"Message sent successfully","id":"<uuid>"}` |
| Invalid / malformed body | `400 {"message":"Validation error","errors":[...]}` |
| Lost both to D1 and email | `500 {"message":"Internal server error"}` |

The row is written to D1 **first** — that is the source of truth. The notification is attempted after,
and its outcome is recorded in the `email_status` column (`pending` / `sent` / `failed: <reason>`).
A submission is only rejected if it failed to store *and* failed to send, so a Resend outage never
costs a lead. To check whether anything went unnotified:

```bash
npx wrangler d1 execute karenmor-contact --remote \
  --command "SELECT created_at, name, email, email_status FROM contact_messages WHERE email_status != 'sent'"
```

---

## Local development

```bash
npm install
npx wrangler login
npx wrangler d1 create karenmor-contact   # paste database_id into wrangler.jsonc
npm run cf-typegen                        # regenerate worker-configuration.d.ts
npm run db:migrate:local                  # create the table in .wrangler/state
npm run dev                               # http://localhost:5173
```

`npm run dev` serves the SPA with HMR **and** runs the real Worker in workerd against a local D1 —
the same database `wrangler d1 ... --local` reads, so migrations and dev share one state directory.

Create a `.dev.vars` (gitignored) so the contact form is testable without sending real email:

```
EMAIL_DRY_RUN=1
RESEND_API_KEY=dry-run-placeholder
```

With `EMAIL_DRY_RUN=1` the notification is logged instead of sent. For a real end-to-end email test,
set a genuine key and `EMAIL_DRY_RUN=0`.

Inspect local submissions:

```bash
npx wrangler d1 execute karenmor-contact --local \
  --command "SELECT created_at, name, email, preferred_contact, email_status FROM contact_messages"
```

### Scripts

| Command | Does |
|---|---|
| `npm run dev` | Vite + workerd dev server with HMR |
| `npm run build` | Builds `dist/client` (assets) and `dist/karenmor` (Worker) |
| `npm run preview` | Builds, then serves the built output in workerd |
| `npm run deploy` | Builds and deploys to Cloudflare |
| `npm run check` | TypeScript check across client, shared and worker |
| `npm run cf-typegen` | Regenerates `worker-configuration.d.ts` — rerun after editing `wrangler.jsonc` |
| `npm run db:migrate:local` / `db:migrate` | Applies D1 migrations locally / remotely |

---

## Deployment

Pushes to `main` are built and deployed automatically by **Cloudflare Workers Builds**.

Dashboard settings (Workers & Pages → `karenmor` → Settings → Builds):

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy -c dist/karenmor/wrangler.json`
- Production branch: `main`

The `-c` flag matters. The Vite plugin generates the deployable config at
`dist/karenmor/wrangler.json` with `assets.directory` filled in; a bare `wrangler deploy` reads the
source `wrangler.jsonc`, which has no asset directory, and fails.

First-time setup and the Render → Cloudflare DNS cutover are documented in
[`docs/cloudflare-cutover.md`](docs/cloudflare-cutover.md).

Secrets are set once and persist across deploys:

```bash
npx wrangler secret put RESEND_API_KEY
```

**Migrations are not part of the build.** After changing `shared/schema.ts`, add a matching SQL file
under `migrations/` and run `npm run db:migrate` yourself before the code that needs it ships.
There is no drizzle-kit in this project — the schema file and the SQL are kept in sync by hand.

---

## Notes for whoever touches this next

- **`run_worker_first: ["/api/*"]` in `wrangler.jsonc` is load-bearing.** With SPA
  `not_found_handling`, a request matching no asset is answered with `index.html` *without invoking
  the Worker*. Remove that line and `POST /api/contact` returns the HTML shell with a 200 — the form
  shows its success toast and every submission is silently discarded. Test with:
  ```bash
  curl -s -X POST <url>/api/contact -H 'content-type: application/json' -d '{}' | head -c 40
  ```
  It must be JSON, never `<!DOCTYPE html>`.
- **`configPath` and `persistState` in `vite.config.ts` are both required** because Vite's `root` is
  `client/`. Without `configPath` the plugin never finds `wrangler.jsonc` and silently builds a stub
  Worker; without `persistState` the dev server and the wrangler CLI use different local databases.
- **`/api/contact` is an unauthenticated public write.** Every submission is a D1 row, a Resend send,
  and an email in Karen's inbox. A Cloudflare WAF rate-limiting rule on
  `http.request.uri.path eq "/api/contact"` (e.g. 5 requests / 10 min per IP) is the zero-code
  baseline; add Turnstile if spam gets through.
- Validation messages are duplicated between `shared/schema.ts` (server) and
  `client/src/pages/home.tsx` (client). That duplication is deliberate — the client bundle does not
  import `@shared`.
