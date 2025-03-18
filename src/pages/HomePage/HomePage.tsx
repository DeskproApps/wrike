import { useCallback } from "react";
import { LoadingSpinner, useDeskproLatestAppContext } from '@deskpro/app-sdk';
import { useNavigate } from "react-router-dom";
import {
  useSetTitle,
  useBadgeCount,
  useRegisterElements,
} from "@/hooks";
import { Home } from "@/components";
import { useLinkedTasks } from "@/hooks";
import type { ITaskFromList } from "@/services/wrike/types";
import { Settings } from '@/types';

const HomePage = () => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const { tasks, isLoading } = useLinkedTasks();
  const navigate = useNavigate();

  const onNavigateToTask = useCallback((task: ITaskFromList) => {
    navigate(`/tasks/${task.id}`);
  }, [navigate]);

  useSetTitle();

  useBadgeCount(tasks);

  useRegisterElements(({ registerElement }) => {
    const isUsingOAuth2 = context?.settings.use_access_token !== true;

    registerElement("refresh", { type: "refresh_button" });
    registerElement("plus", {
      type: "plus_button",
      payload: { type: "changePage", path: "/tasks/link" },
    });
    isUsingOAuth2 && registerElement('menu', {
      type: 'menu',
      items: [
        {
          title: 'Log Out',
          payload: {
            type: 'logOut'
          }
        }
      ]
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