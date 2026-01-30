import { routes } from "./Routes";

export function frontendUrl(baseUrl: string, path: string): string {
  // Remove trailing slash from baseUrl if present
  const normalizedBaseUrl = baseUrl.endsWith("/")
    ? baseUrl.slice(0, -1)
    : baseUrl;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return normalizedBaseUrl + normalizedPath;
}

export { routes };
