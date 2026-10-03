// Dev-only static server: directory index, 404.html for misses, correct MIME types.
// Usage: node scripts/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const PORT = Number(process.argv[2] || process.env.PORT || 4321);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp",
  ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".mp4": "video/mp4", ".webm": "video/webm",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".webmanifest": "application/manifest+json",
};
const BLOCK = /^\/(node_modules|scripts|qa|\.git)(\/|$)/;

async function resolve(urlPath) {
  let p = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  if (BLOCK.test(p)) return null;
  let file = join(ROOT, p);
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!urlPath.endsWith("/")) return { redirect: urlPath + "/" };
      file = join(file, "index.html");
      await stat(file);
    }
    return { file };
  } catch { return null; }
}

export function serve(port = PORT) {
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, "http://x");
    const r = await resolve(url.pathname);
    if (r?.redirect) { res.writeHead(301, { Location: r.redirect + url.search }); return res.end(); }
    const file = r?.file || join(ROOT, "404.html");
    const body = await readFile(file);
    res.writeHead(r ? 200 : 404, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(body);
  });
  return new Promise((ok) => server.listen(port, () => ok(server)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await serve();
  console.log(`ARC Labs → http://localhost:${PORT}`);
}
