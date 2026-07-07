
import app from "../src/app";
import { connectDB } from "../src/config/db";
import { seedSuperAdmin } from "../src/scripts/seedAdmin";
import type { IncomingMessage, ServerResponse } from "http";
let isConnected = false;

const handler = async (req: IncomingMessage, res: ServerResponse) => {
  if (!isConnected) {
    try {
      await connectDB();
      await seedSuperAdmin();
      isConnected = true;
    } catch (err) {
      console.error("Failed to initialize:", err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: "Server initialization failed" }));
      return;
    }
  }
  return app(req, res);
};

export default handler;
