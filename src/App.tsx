import { Route, Routes, useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { useDeskproAppEvents, useDeskproAppClient } from "@deskpro/app-sdk";
import { CreateNote } from "./pages/Create/Note";
import {
  HomePage,
  ViewTaskPage,
  EditTaskPage,
  LinkTasksPage,
  LoadingAppPage,
  CreateTaskPage,
  VerifySettingsPage,
} from "@/pages";
import { isNavigatePayload } from "@/utils";

const App = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();

  const debounceElementEvent = useDebouncedCallback((_, __, payload) => {
    return match(payload?.type)
      .with("changePage", () => isNavigatePayload(payload) && navigate(payload.path))
      .run();
  }, 500);

  useDeskproAppEvents({
    onElementEvent: debounceElementEvent,
  }, [client]);

  return (
    <Routes>
      <Route path="/admin/verify_settings" element={<VerifySettingsPage/>} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/tasks/link" element={<LinkTasksPage />} />
      <Route path="/tasks/create" element={<CreateTaskPage />} />
      <Route path="/tasks/:taskId" element={<ViewTaskPage />} />
      <Route path="/tasks/:taskId/edit" element={<EditTaskPage />} />
      <Route path="/create/note/:taskId" element={<CreateNote />} />
      <Route index element={<LoadingAppPage />} />
    </Routes>
  );
}

export { App };
