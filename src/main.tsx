import { Suspense, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Scrollbar } from "@deskpro/deskpro-ui";
import { DeskproAppProvider, LoadingSpinner } from "@deskpro/app-sdk";
import { ReplyBoxProvider } from "@/hooks";
import { query } from "@/utils/query";
import { App } from "@/App";
import { ErrorFallback } from "@/components/ErrorFallback/ErrorFallback";

import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";
import "./main.css";

TimeAgo.addDefaultLocale(en);

const root = ReactDOM.createRoot(document.getElementById("root") as Element);
root.render(
  <StrictMode>
    <Scrollbar style={{ height: "100%", width: "100%" }}>
      <DeskproAppProvider>
        <HashRouter>
          <QueryClientProvider client={query}>
            <Suspense fallback={<LoadingSpinner />}>
              <QueryErrorResetBoundary>
                {({ reset }) => (
                  <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                    <ReplyBoxProvider>
                      <App />
                    </ReplyBoxProvider>
                  </ErrorBoundary>
                )}
              </QueryErrorResetBoundary>
            </Suspense>
          </QueryClientProvider>
        </HashRouter>
      </DeskproAppProvider>
    </Scrollbar>
  </StrictMode>
);
