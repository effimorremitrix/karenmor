import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactMessages = sqliteTable("contact_messages", {
  // D1 is SQLite — there is no gen_random_uuid(). The id is generated in the
  // Worker with crypto.randomUUID() before the insert.
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  preferredContact: text("preferred_contact").notNull(),
  createdAt: text("created_at").notNull(),
  // "pending" | "sent" | "failed: <reason>" — makes a missed notification
  // auditable with one query instead of only existing in the logs.
  emailStatus: text("email_status").notNull().default("pending"),
});

// Every field below is explicitly redefined in .extend(), so the validation
// contract is fully specified here and is independent of the Drizzle dialect.
// Do not drop a .extend() line assuming the column definition covers it.
export const insertContactMessageSchema = createInsertSchema(contactMessages)
  .omit({
    id: true,
    createdAt: true,
    emailStatus: true,
  })
  .extend({
    name: z.string().min(2, "נא להזין שם מלא"),
    email: z.string().email("נא להזין כתובת אימייל תקינה"),
    phone: z.string().min(9, "נא להזין מספר טלפון תקין"),
    message: z.string().min(10, "נא להזין הודעה"),
    preferredContact: z.enum(["phone", "email", "whatsapp"]),
  });

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
