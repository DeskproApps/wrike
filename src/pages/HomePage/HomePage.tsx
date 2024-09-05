import { useCallback } from "react";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import {
  useSetTitle,
  useBadgeCount,
  useRegisterElements,
} from "@/hooks";
import { Home } from "@/components";
import { useTasks } from "./hooks";
import type { ITaskFromList } from "@/services/wrike/types";

const HomePage = () => {
  const navigate = useNavigate();

  const { tasks, isLoading } = useTasks();

  const onNavigateToTask = useCallback((task: ITaskFromList) => {
    navigate(`/view/task/${task.id}`);
  }, [navigate]);

  useSetTitle();

  useBadgeCount(tasks);

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/tasks/link" },
    });
  }, []);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <Home
      tasks={tasks}
      onNavigateToTask={onNavigateToTask}
    />
  );
};

export { HomePage };