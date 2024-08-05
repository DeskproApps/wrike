import { Suspense } from "react";
import { QueryClientProvider, QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { HashRouter, Route, Routes } from "react-router-dom";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { query } from "./utils/query";
import { ErrorFallback } from "./components/ErrorFallback/ErrorFallback";
import { Main } from "./pages/Main";
import { Redirect } from "./components/Redirect/Redirect";
import { CreateNote } from "./pages/Create/Note";
import { FindOrCreate } from "./pages/FindOrCreate/FindOrCreate";
import { ViewTask } from "./pages/View/Task";
import { EditTask } from "./pages/Edit/Task";
import { VerifySettingsPage } from "./pages/VerifySettingsPage";

import "@deskpro/deskpro-ui/dist/deskpro-custom-icons.css";
import "@deskpro/deskpro-ui/dist/deskpro-ui.css";
import "flatpickr/dist/themes/light.css";
import "simplebar/dist/simplebar.min.css";
import "tippy.js/dist/tippy.css";

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={query}>
        <Suspense fallback={<LoadingSpinner />}>
          <QueryErrorResetBoundary>
            {({ reset }) => (
              <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
                <Routes>
                  <Route path="/admin/verify_settings" element={<VerifySettingsPage/>} />
                  <Route path="/findOrCreate" element={<FindOrCreate />} />
                  <Route path="/create/note/:taskId" element={<CreateNote />} />
                  <Route path="/edit/task/:taskId" element={<EditTask />} />
                  <Route path="/view/task/:taskId" element={<ViewTask />} />
                  <Route path="/redirect" element={<Redirect />} />
                  <Route index element={<Main />} />
                </Routes>
              </ErrorBoundary>
            )}
          </QueryErrorResetBoundary>
        </Suspense>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;
