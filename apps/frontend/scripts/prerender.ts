import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");
// eslint-disable-next-line no-restricted-properties -- build script, not a Vite module
const siteUrl = (process.env.SITE_URL ?? "").replace(/\/$/, "");

function buildHreflangTags(
  route: string,
  languages: readonly string[],
): string {
  const canonicalRoute = route === "/" ? "/" : route;

  const tags = languages.map((lang) => {
    const href = `${siteUrl}${canonicalRoute}?lang=${lang}`;
    return `<link rel="alternate" hreflang="${lang}" href="${href}" />`;
  });

  // x-default points to the route without a lang param
  tags.push(
    `<link rel="alternate" hreflang="x-default" href="${siteUrl}${canonicalRoute}" />`,
  );

  return tags.join("\n    ");
}

function buildSitemap(
  prerenderRoutes: string[],
  languages: readonly string[],
): string {
  const urls = prerenderRoutes.map((route) => {
    const canonicalRoute = route === "/" ? "/" : route;
    const loc = `${siteUrl}${canonicalRoute}`;

    const hreflangLinks = languages
      .map(
        (lang) =>
          `    <xhtml:link rel="alternate" hreflang="${lang}" href="${loc}?lang=${lang}" />`,
      )
      .concat(
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${loc}" />`,
      )
      .join("\n");

    return `  <url>\n    <loc>${loc}</loc>\n${hreflangLinks}\n  </url>`;
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    "</urlset>",
  ].join("\n");
}

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
  const { render, prerenderRoutes, languages, fallbackLng } = (await import(
    path.join(distDir, "server", "entry-server.js")
  )) as {
    render: (url: string, lang?: string) => Promise<string>;
    prerenderRoutes: string[];
    languages: readonly string[];
    fallbackLng: string;
  };

  for (const route of prerenderRoutes) {
    const hreflangTags = siteUrl ? buildHreflangTags(route, languages) : "";
    const canonicalUrl = siteUrl
      ? `${siteUrl}${route === "/" ? "/" : route}`
      : "";

    for (const lang of languages) {
      const appHtml = await render(route, lang);

      // Extract the translated meta description from the React-rendered HTML
      const descriptionMatch =
        /<meta\s+name="description"\s+content="([^"]*)"/.exec(appHtml);
      const description = descriptionMatch?.[1] ?? "";

      let finalHtml = template.replace(
        '<html lang="en">',
        `<html lang="${lang}">`,
      );

      // Patch the <head> meta description with the translated value
      if (description) {
        finalHtml = finalHtml.replace(
          /(<meta\s*\n?\s*name="description"\s*\n?\s*content=")[^"]*(")/,
          `$1${description}$2`,
        );
        // Patch OG description to match
        finalHtml = finalHtml.replace(
          /(<meta\s*\n?\s*property="og:description"\s*\n?\s*content=")[^"]*(")/,
          `$1${description}$2`,
        );
      }

      // Patch OG locale
      finalHtml = finalHtml.replace(
        /(<meta\s*\n?\s*property="og:locale"\s*\n?\s*content=")[^"]*(")/,
        `$1${lang}$2`,
      );

      // Inject canonical URL, OG URL, and absolutify og:image
      if (canonicalUrl) {
        finalHtml = finalHtml.replace(
          "</head>",
          `    <link rel="canonical" href="${canonicalUrl}" />\n    <meta property="og:url" content="${canonicalUrl}" />\n  </head>`,
        );
        finalHtml = finalHtml.replace(
          /(<meta\s*\n?\s*property="og:image"\s*\n?\s*content=")[^"]*(")/,
          `$1${siteUrl}/image.png$2`,
        );
      }

      // Inject hreflang tags
      if (hreflangTags) {
        finalHtml = finalHtml.replace(
          "</head>",
          `    ${hreflangTags}\n  </head>`,
        );
      }

      finalHtml = finalHtml.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`,
      );

      // Default language → index.html, others → index.<lang>.html
      // For sub-routes: /legal/foo → legal/foo/index.html or legal/foo/index.<lang>.html
      let outPath: string;
      if (route === "/") {
        outPath =
          lang === fallbackLng
            ? path.join(distDir, "index.html")
            : path.join(distDir, `index.${lang}.html`);
      } else {
        const baseName =
          lang === fallbackLng ? "index.html" : `index.${lang}.html`;
        outPath = path.join(distDir, route, baseName);
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, finalHtml);

      console.log(
        `Pre-rendered ${route} [${lang}] → ${path.relative(distDir, outPath)}`,
      );
    }
  }

  // Generate sitemap.xml and robots.txt (only when SITE_URL is set)
  if (siteUrl) {
    const sitemap = buildSitemap(prerenderRoutes, languages);
    fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemap);
    console.log("Generated sitemap.xml");

    const robots = [
      "User-agent: *",
      "Allow: /",
      "",
      `Sitemap: ${siteUrl}/sitemap.xml`,
      "",
    ].join("\n");
    fs.writeFileSync(path.join(distDir, "robots.txt"), robots);
    console.log("Generated robots.txt");
  }

  // Clean up server bundle — no longer needed at runtime
  fs.rmSync(path.join(distDir, "server"), { recursive: true });
}

prerender().catch((err) => {
  console.error("Prerender failed:", err);
  process.exit(1);
});
