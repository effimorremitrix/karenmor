import { handleContact } from "./contact";

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return Response.json(
          { message: "Method not allowed" },
          { status: 405, headers: { Allow: "POST" } },
        );
      }
      return handleContact(request, env, ctx);
    }

    if (url.pathname.startsWith("/api/")) {
      return Response.json({ message: "Not found" }, { status: 404 });
    }

    // `run_worker_first` scopes the Worker to /api/*, so static requests are
    // normally served by the asset pipeline without ever reaching here. This is
    // the fallback for anything that does.
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
