// Bindings that `wrangler types` cannot see, declared by hand so that a fresh
// clone type-checks without a local .dev.vars file. `Env` is a global interface
// in worker-configuration.d.ts, so these merge into it.
declare global {
  interface Env {
    /** Resend API key. Set with `wrangler secret put RESEND_API_KEY`. */
    RESEND_API_KEY: string;
    /** Local-dev only: set to "1" in .dev.vars to log emails instead of sending. */
    EMAIL_DRY_RUN?: string;
  }
}

export {};
