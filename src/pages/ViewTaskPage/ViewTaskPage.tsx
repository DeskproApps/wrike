import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingSpinner, useDeskproLatestAppContext } from '@deskpro/app-sdk';
import { useTask, useSetTitle, useRegisterElements } from "@/hooks";
import { ViewTask } from "@/components";
import type { FC } from "react";
import { Settings } from '@/types';

const ViewTaskPage: FC = () => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { task, notes, subItems, isLoading } = useTask(taskId);

  const onNavigateToAddNote = useCallback(() => {
    navigate(`/create/note/${taskId}`);
  }, [navigate, taskId]);

  useSetTitle();

  useRegisterElements(({ registerElement }) => {
    const isUsingOAuth = context?.settings.use_access_token === false || context?.settings.use_advanced_connect === false

    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    registerElement("menu", {
      type: "menu",
      items: [
        {
          title: "Unlink task",
          payload: { type: "unlink", task },
        },
        ...(isUsingOAuth ? [{
          title: 'Log Out',
          payload: { type: 'logOut' },
        }] : [])
      ],
    });
    task?.id && registerElement("edit", {
      type: "edit_button",
      payload: {
        type: "changePage",
        path: `/tasks/${task.id}/edit`,
      },
    });
  }, [task]);

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <ViewTask
      task={task}
      notes={notes}
      subItems={subItems}
      onNavigateToAddNote={onNavigateToAddNote}
    />
  );
};

export { ViewTaskPage };