# Task: Migrate karenmor.com from Render to Cloudflare Workers

## Status: REVIEW

## Steps
- [x] Add Cloudflare toolchain deps (`@cloudflare/vite-plugin`, `wrangler`); remove Node-server deps ✅
- [x] Create `wrangler.jsonc` (assets + D1 binding + vars) ✅
- [x] Create `worker/index.ts`, `worker/contact.ts`, `worker/email.ts`, `worker/env.d.ts` ✅
- [x] Convert `shared/schema.ts` to `sqliteTable`; drop unused `users`; add `created_at` + `email_status` ✅
- [x] Add `migrations/0001_create_contact_messages.sql` ✅
- [x] Update `vite.config.ts` (cloudflare plugin) and `package.json` scripts ✅
- [x] Delete `server/`, `script/build.ts`, `drizzle.config.ts`, `replit.md` ✅
- [x] Add `README.md` + `docs/cloudflare-cutover.md` ✅
- [x] Verify: typecheck, build, dev, preview, D1 row, 400/201 contracts, SPA fallback ✅
- [ ] Human: run the DNS cutover in `docs/cloudflare-cutover.md`

## Review

### What changed
The Express service is gone. A Cloudflare Worker now serves the SPA from static assets and handles
the single `POST /api/contact` route. `client/` is untouched apart from one pre-existing type error.

Deleted: `server/` (5 files), `script/build.ts`, `drizzle.config.ts`, `replit.md`.
Added: `worker/` (4 files), `wrangler.jsonc`, `migrations/`, `README.md`, `docs/cloudflare-cutover.md`.

### Contact submissions are no longer lost
`MemStorage` dropped every message on restart, and the Drizzle schema was never wired to a database.
Submissions now go to D1 first (source of truth), then a Resend notification whose outcome is stored
in `email_status`. A request only fails if the message was lost both ways, so a Resend outage never
costs a lead, and a missed notification is one SQL query away rather than log-only.

### Verified
- `npm run check` clean; `npm run build` emits `dist/client` + `dist/karenmor`
- `wrangler deploy --dry-run` reads 9 assets, 51 KiB gzipped, all four bindings resolve
- Against `vite preview` (real workerd) and `vite dev`: 201 on valid, 400 on invalid/malformed/empty,
  405 on GET, 404 on unknown `/api/*`, Hebrew validation messages intact
- `POST /api/contact` returns JSON, not the HTML shell — the `run_worker_first` trap
- Deep links return `200 text/html`; favicon, hashed JS/CSS, and images all serve
- Row lands in D1 with `email_status='sent'`; with a bad Resend key the row still lands and records
  `failed: Resend 401: ...` while the visitor still gets 201

### Three traps found during implementation
1. Vite `root` is `client/`, so the plugin never found `wrangler.jsonc` and silently built a **stub
   Worker with no routes or bindings**. Fixed with an explicit `configPath`.
2. The dev server and the wrangler CLI used **different local D1 databases** (`client/.wrangler` vs
   `.wrangler`), so migrations applied to a database the app never opened. Fixed with `persistState`.
3. A bare `wrangler deploy` reads the source `wrangler.jsonc`, which has no `assets.directory`, and
   fails. The deploy must target the generated `dist/karenmor/wrangler.json`.

### Out of scope, worth doing later
- WAF rate limit on `/api/contact` — it's an unauthenticated public write that now costs email quota
  (noted in the cutover doc)
- `image_1766602158162.png` is a 338 KB unoptimized PNG used as a profile photo
- The unused shadcn/ui components (~40 files) still pull in `recharts`, `embla-carousel`, etc.
