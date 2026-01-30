import { env } from "~/env";

export default function Page() {
  window.location.replace(env.VITE_BOT_REPO_URL);
  return null;
}
