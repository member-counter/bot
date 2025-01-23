import type { MetadataRoute } from "next";

import { Routes } from "~/other/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    Routes.Home,
    Routes.Support,
    Routes.Documentation,
    Routes.Translate,
    Routes.Status,
  ].map((route) => {
    return {
      url: route,
      lastModified: new Date(),
    };
  });
}
