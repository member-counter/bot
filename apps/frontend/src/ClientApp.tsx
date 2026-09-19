import { BrowserRouter } from "react-router";

import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import { NavigationBlockerProvider } from "./lib/navigation";

export default function ClientApp() {
  return (
    <AppProviders>
      <BrowserRouter>
        <NavigationBlockerProvider>
          <AppRoutes />
        </NavigationBlockerProvider>
      </BrowserRouter>
    </AppProviders>
  );
}
