import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import express from "express";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve video files from public directory
  app.use('/api/video', express.static(path.join(process.cwd(), 'public')));

  const httpServer = createServer(app);

  return httpServer;
}
