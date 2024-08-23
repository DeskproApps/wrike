import { Route, Routes, useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { useDeskproAppEvents, useDeskproAppClient } from "@deskpro/app-sdk";
import { Redirect } from "./components/Redirect/Redirect";
import { CreateNote } from "./pages/Create/Note";
import { FindOrCreate } from "./pages/FindOrCreate/FindOrCreate";
import { ViewTask } from "./pages/View/Task";
import { EditTask } from "./pages/Edit/Task";
import { HomePage, LoadingAppPage, VerifySettingsPage } from "@/pages";
import { isNavigatePayload } from "@/utils";

const App = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();

  const debounceElementEvent = useDebouncedCallback((_, __, payload) => {
    return match(payload.type)
      .with("changePage", () => isNavigatePayload(payload) && navigate(payload.path))
      .run();
  }, 500);

  useDeskproAppEvents({
    onElementEvent: debounceElementEvent,
  }, [client]);

  return (
    <Routes>
      <Route path="/findOrCreate" element={<FindOrCreate />} />
      <Route path="/create/note/:taskId" element={<CreateNote />} />
      <Route path="/edit/task/:taskId" element={<EditTask />} />
      <Route path="/view/task/:taskId" element={<ViewTask />} />
      <Route path="/redirect" element={<Redirect />} />

      <Route path="/admin/verify_settings" element={<VerifySettingsPage/>} />
      <Route path="/home" element={<HomePage />} />
      <Route index element={<LoadingAppPage />} />
    </Routes>
  );
}

export { App };
