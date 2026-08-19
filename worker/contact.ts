import { drizzle } from "drizzle-orm/d1";
import { eq } from "drizzle-orm";
import { contactMessages, insertContactMessageSchema } from "@shared/schema";
import { sendContactNotification } from "./email";

export async function handleContact(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { message: "Validation error", errors: [] },
      { status: 400 },
    );
  }

  const parsed = insertContactMessageSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { message: "Validation error", errors: parsed.error.errors },
      { status: 400 },
    );
  }

  const record = {
    id: crypto.randomUUID(),
    ...parsed.data,
    createdAt: new Date().toISOString(),
    emailStatus: "pending",
  };

  const db = drizzle(env.DB);

  // Store first — D1 is the source of truth for every submission.
  let persisted = false;
  try {
    await db.insert(contactMessages).values(record);
    persisted = true;
  } catch (error) {
    console.error(`[contact] D1 insert failed for ${record.id}:`, error);
  }

  // Then notify. Awaited rather than fired into waitUntil, because whether the
  // email got through decides both the status code and the recorded status.
  let emailError: string | undefined;
  try {
    await sendContactNotification(env, record);
  } catch (error) {
    emailError = error instanceof Error ? error.message : String(error);
    console.error(`[contact] notification failed for ${record.id}:`, emailError);
  }

  // Only fail the request if the message was lost both ways. If either the row
  // or the email survived, the visitor is right to be told it went through.
  if (!persisted && emailError) {
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }

  if (persisted) {
    ctx.waitUntil(
      db
        .update(contactMessages)
        .set({
          emailStatus: emailError
            ? `failed: ${emailError.slice(0, 300)}`
            : "sent",
        })
        .where(eq(contactMessages.id, record.id))
        .catch((error) =>
          console.error(
            `[contact] email_status update failed for ${record.id}:`,
            error,
          ),
        ),
    );
  }

  return Response.json(
    { message: "Message sent successfully", id: record.id },
    { status: 201 },
  );
}
