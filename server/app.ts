import express from "express";
import { generateGoStarsReportAI } from "./ai";

export const app = express();

app.use(express.json({ limit: "15mb" }));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    appName: "GoStars – Teacher Management System",
    timestamp: new Date().toISOString()
  });
});

// AI Report Generation endpoint with Authentication & Authorization check
const handleAiGenerateReport = async (req: express.Request, res: express.Response) => {
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

    const reportText = await generateGoStarsReportAI(req.body);
    res.json({ success: true, reportText });
  } catch (err: any) {
    console.error("Error in AI report route:", err?.message || "unknown");
    res.status(500).json({ error: "Failed to generate report", details: err?.message });
  }
};

app.post("/api/ai/generate-report", handleAiGenerateReport);
app.post("/api/generate-report", handleAiGenerateReport);

// Global Express Error Handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: err?.message || "Internal Server Error" });
});
