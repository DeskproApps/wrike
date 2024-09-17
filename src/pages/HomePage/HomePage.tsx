import { useCallback } from "react";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import {
  useSetTitle,
  useBadgeCount,
  useRegisterElements,
} from "@/hooks";
import { Home } from "@/components";
import { useLinkedTasks } from "@/hooks";
import type { ITaskFromList } from "@/services/wrike/types";

const HomePage = () => {
  const navigate = useNavigate();

  const { tasks, isLoading } = useLinkedTasks();

  const onNavigateToTask = useCallback((task: ITaskFromList) => {
    navigate(`/tasks/${task.id}`);
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
