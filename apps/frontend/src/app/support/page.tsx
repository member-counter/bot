import { env } from "~/env";

export default function Page() {
  window.location.replace(env.VITE_SUPPORT_URL);
  return null;
}
