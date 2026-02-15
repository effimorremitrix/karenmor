import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  message: text("message").notNull(),
  preferredContact: text("preferred_contact").notNull(),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages)
  .omit({
    id: true,
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
