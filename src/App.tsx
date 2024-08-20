import { Route, Routes } from "react-router-dom";
import { Main } from "./pages/Main";
import { Redirect } from "./components/Redirect/Redirect";
import { CreateNote } from "./pages/Create/Note";
import { FindOrCreate } from "./pages/FindOrCreate/FindOrCreate";
import { ViewTask } from "./pages/View/Task";
import { EditTask } from "./pages/Edit/Task";
import { VerifySettingsPage } from "./pages/VerifySettingsPage";

const App = () => {
  return (
    <Routes>
      <Route path="/admin/verify_settings" element={<VerifySettingsPage/>} />
      <Route path="/findOrCreate" element={<FindOrCreate />} />
      <Route path="/create/note/:taskId" element={<CreateNote />} />
      <Route path="/edit/task/:taskId" element={<EditTask />} />
      <Route path="/view/task/:taskId" element={<ViewTask />} />
      <Route path="/redirect" element={<Redirect />} />
      <Route index element={<Main />} />
    </Routes>
  );
}

export { App };
