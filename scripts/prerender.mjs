// Renders the site's pages to static HTML for GitHub Pages.
// Starts the built Node server, saves each page, then stops it.
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";

const PORT = 3939;
const ROUTES = ["/", "/download", "/guide", "/faq"];
const PUBLIC_DIR = ".output/public";

const server = spawn("node", [".output/server/index.mjs"], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: "inherit",
});

const base = `http://localhost:${PORT}`;

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(base + "/");
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("server did not start");
}

try {
  await waitForServer();
  for (const route of ROUTES) {
    const res = await fetch(base + route);
    if (!res.ok) throw new Error(`${route} -> ${res.status}`);
    const html = await res.text();
    const dir = route === "/" ? PUBLIC_DIR : `${PUBLIC_DIR}${route}`;
    mkdirSync(dir, { recursive: true });
    writeFileSync(`${dir}/index.html`, html);
    console.log("prerendered", route);
  }
  // GitHub Pages serves 404.html for unknown paths; use the app shell so
  // client-side routes (/admin, /auth, ...) still load.
  copyFileSync(`${PUBLIC_DIR}/index.html`, `${PUBLIC_DIR}/404.html`);
} finally {
  server.kill("SIGKILL");
}
