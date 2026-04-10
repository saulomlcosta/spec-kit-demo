import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createDatabase } from "./db.js";
import { createAlbum, listAlbumsByDate, reorderAlbum } from "./albums-repository.js";
import { addPhoto, getAlbumPhotos, getPhoto, updatePreviewStatus } from "./photos-repository.js";
import { readLocalPreview } from "./local-files.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

export function createApp({ db = createDatabase(), useVite = process.env.NODE_ENV !== "production" } = {}) {
  let vite;

  async function handleApi(req, res, url) {
    try {
      if (req.method === "GET" && url.pathname === "/api/albums") {
        return json(res, { groups: listAlbumsByDate(db) });
      }

      if (process.env.NODE_ENV === "test" && req.method === "POST" && url.pathname === "/api/test/reset") {
        db.exec("DELETE FROM photos; DELETE FROM albums;");
        return json(res, { ok: true });
      }

      if (req.method === "POST" && url.pathname === "/api/albums") {
        const album = createAlbum(db, await readJson(req));
        return json(res, { album, groups: listAlbumsByDate(db) }, 201);
      }

      if (req.method === "POST" && url.pathname === "/api/albums/reorder") {
        const groups = reorderAlbum(db, await readJson(req));
        return json(res, { groups });
      }

      const photoListMatch = url.pathname.match(/^\/api\/albums\/(\d+)\/photos$/);
      if (photoListMatch && req.method === "GET") {
        return json(res, { photos: getAlbumPhotos(db, Number(photoListMatch[1])) });
      }

      if (photoListMatch && req.method === "POST") {
        const photo = addPhoto(db, { ...(await readJson(req)), albumId: Number(photoListMatch[1]) });
        return json(res, { photo }, 201);
      }

      const previewMatch = url.pathname.match(/^\/api\/photos\/(\d+)\/preview$/);
      if (previewMatch && req.method === "GET") {
        const photo = getPhoto(db, Number(previewMatch[1]));
        if (!photo) return json(res, { error: "Photo not found." }, 404);
        const preview = readLocalPreview(photo);
        if (!preview) {
          updatePreviewStatus(db, photo.id, "missing");
          return json(res, { error: "Preview unavailable." }, 404);
        }
        updatePreviewStatus(db, photo.id, "available");
        res.writeHead(200, { "content-type": preview.contentType });
        return fs.createReadStream(preview.path).pipe(res);
      }

      return false;
    } catch (error) {
      return json(res, { error: error.message }, 400);
    }
  }

  async function handler(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (handled !== false) return;
    }

    if (useVite) {
      vite ||= await createViteMiddleware();
      return vite.middlewares(req, res, () => notFound(res));
    }

    return serveStatic(req, res);
  }

  return http.createServer((req, res) => {
    handler(req, res).catch((error) => json(res, { error: error.message }, 500));
  });
}

async function createViteMiddleware() {
  const { createServer } = await import("vite");
  return createServer({ root, server: { middlewareMode: true }, appType: "spa" });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Request body too large."));
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON request body."));
      }
    });
  });
}

function json(res, body, status = 200) {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
  return true;
}

function notFound(res) {
  res.writeHead(404, { "content-type": "text/plain" });
  res.end("Not found");
}

function serveStatic(req, res) {
  const url = new URL(req.url, "http://localhost");
  const filePath = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  const resolved = path.resolve(root, "dist", filePath);
  if (!resolved.startsWith(path.resolve(root, "dist"))) {
    return notFound(res);
  }
  if (!fs.existsSync(resolved)) {
    return notFound(res);
  }
  res.writeHead(200);
  fs.createReadStream(resolved).pipe(res);
  return true;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 5173);
  createApp().listen(port, "127.0.0.1", () => {
    console.log(`Photo Album Organizer running at http://127.0.0.1:${port}`);
  });
}
