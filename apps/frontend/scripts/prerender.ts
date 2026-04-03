import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");

async function prerender() {
  const indexPath = path.join(distDir, "index.html");
  const fallbackPath = path.join(distDir, "200.html");

  // Use the SPA fallback as the clean template if it exists (from a previous run),
  // otherwise use index.html (first run — fresh from vite build).
  const templatePath = fs.existsSync(fallbackPath) ? fallbackPath : indexPath;
  const template = fs.readFileSync(templatePath, "utf-8");

  // Save/update the clean SPA fallback
  if (templatePath !== fallbackPath) {
    fs.writeFileSync(fallbackPath, template);
  }

  // Import the SSR bundle
  const { render, prerenderRoutes } = (await import(
    path.join(distDir, "server", "entry-server.js")
  )) as {
    render: (url: string) => Promise<string>;
    prerenderRoutes: string[];
  };

  for (const route of prerenderRoutes) {
    const appHtml = await render(route);

    const finalHtml = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`,
    );

    // "/" → dist/index.html, "/legal/foo" → dist/legal/foo/index.html
    const outPath =
      route === "/"
        ? indexPath
        : path.join(distDir, route, "index.html");

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, finalHtml);

    console.log(`Pre-rendered ${route} → ${path.relative(distDir, outPath)}`);
  }

  // Clean up server bundle — no longer needed at runtime
  fs.rmSync(path.join(distDir, "server"), { recursive: true });
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
