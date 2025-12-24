import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactMessageSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactMessageSchema.safeParse(req.body);
      
      if (!parsed.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: parsed.error.errors 
        });
      }

      const message = await storage.createContactMessage(parsed.data);
      res.status(201).json({ message: "Message sent successfully", id: message.id });
    } catch (error) {
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
