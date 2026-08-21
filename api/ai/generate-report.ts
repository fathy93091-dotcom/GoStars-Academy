import type { IncomingMessage, ServerResponse } from "http";
import { generateGoStarsReportAI } from "../../server/ai";

export default async function handler(req: any, res: any) {
  // CORS handling
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: Valid authentication token required to generate reports"
      });
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: Empty authentication credentials"
      });
    }

    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const reportText = await generateGoStarsReportAI(body);
    return res.status(200).json({ success: true, reportText });
  } catch (err: any) {
    console.error("Vercel Serverless Function Error:", err?.message || err);
    return res.status(500).json({ error: "Failed to generate report", details: err?.message });
  }
}
