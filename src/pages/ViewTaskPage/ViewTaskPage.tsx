import { useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@deskpro/app-sdk";
import { useTask, useSetTitle, useRegisterElements } from "@/hooks";
import { ViewTask } from "@/components";
import type { FC } from "react";

const ViewTaskPage: FC = () => {
  const navigate = useNavigate();
  const { taskId } = useParams();
  const { task, notes, isLoading } = useTask(taskId);

  const onNavigateToAddNote = useCallback(() => {
    navigate(`/create/note/${taskId}`);
  }, [navigate, taskId]);

  useSetTitle();

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    registerElement("menu", {
      type: "menu",
      items: [{
        title: "Unlink task",
        payload: { type: "unlink", task },
      }],
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
      <LoadingSpinner/>
    );
  }

  return (
    <ViewTask
      task={task}
      notes={notes}
      onNavigateToAddNote={onNavigateToAddNote}
    />
  );
};

export { ViewTaskPage };
