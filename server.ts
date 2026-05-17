import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import { Storage } from "@google-cloud/storage";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const bucketName = process.env.GCS_BUCKET_NAME;
  const storage = new Storage();
  const upload = multer({ storage: multer.memoryStorage() });

  if (!bucketName) {
    console.warn("GCS_BUCKET_NAME is not set. /api/upload will return a configuration error.");
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", mode: process.env.NODE_ENV });
  });

  // API Route for file upload
  app.post("/api/upload", (req, res) => {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        console.error("Multer error:", err);
        return res.status(500).json({ error: "File upload failed", details: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!bucketName) {
        return res.status(500).json({ error: "GCS_BUCKET_NAME is not configured" });
      }

      const safeOriginalName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "-");
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileName = `uploads/${uniqueSuffix}-${safeOriginalName}`;
      const file = storage.bucket(bucketName).file(fileName);

      try {
        await file.save(req.file.buffer, {
          metadata: {
            contentType: req.file.mimetype,
          },
          resumable: false,
        });

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        console.log(`Successfully uploaded: ${publicUrl}`);
        res.json({ url: publicUrl });
      } catch (uploadError) {
        console.error("Cloud Storage upload error:", uploadError);
        res.status(500).json({
          error: "File upload failed",
          details: uploadError instanceof Error ? uploadError.message : "Unknown upload error",
        });
      }
    });
  });

  // Serve static files from public
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
