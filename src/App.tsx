import { Route, Routes, useNavigate } from "react-router-dom";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import { useDeskproAppEvents, useDeskproAppClient, LoadingSpinner } from "@deskpro/app-sdk";
import { useLogOut, useUnlinkTask } from '@/hooks';
import { isLogOutPayload, isNavigatePayload, isUnlinkPayload } from '@/utils';
import {
  HomePage,
  ViewTaskPage,
  EditTaskPage,
  LinkTasksPage,
  LoadingAppPage,
  CreateTaskPage,
  CreateNotePage,
  VerifySettingsPage,
  AdminCallbackPage,
  LogInPage
} from "@/pages";

const App = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { unlink, isLoading } = useUnlinkTask();
  const { logOut } = useLogOut();

  const debounceElementEvent = useDebouncedCallback((_, __, payload) => {
    return match(payload?.type)
      .with("changePage", () => isNavigatePayload(payload) && navigate(payload.path))
      .with("unlink", () => isUnlinkPayload(payload) && unlink(payload.task))
      .with('logOut', () => isLogOutPayload(payload) && logOut())
      .run();
  }, 500);

  useDeskproAppEvents({
    onElementEvent: debounceElementEvent,
  }, [client]);

  if (!client || isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Routes>
      <Route path="/admin/verify_settings" element={<VerifySettingsPage/>} />
      <Route path='/admin/callback' element={<AdminCallbackPage />} />
      <Route path='/log_in' element={<LogInPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/tasks/link" element={<LinkTasksPage />} />
      <Route path="/tasks/create" element={<CreateTaskPage />} />
      <Route path="/tasks/:taskId" element={<ViewTaskPage />} />
      <Route path="/tasks/:taskId/edit" element={<EditTaskPage />} />
      <Route path="/create/note/:taskId" element={<CreateNotePage />} />
      <Route index element={<LoadingAppPage />} />
    </Routes>
  );
}

export { App };