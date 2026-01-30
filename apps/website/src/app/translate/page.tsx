import { env } from "~/env";

export default function Page() {
  window.location.replace(env.VITE_TRANSLATION_PLATFORM_URL);
  return null;
}
