import { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LoadingSpinner,
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { editTask } from "@/services/wrike";
import {
  useTask,
  useSetTitle,
  useAsyncError,
  useRegisterElements,
} from "@/hooks";
import { getError } from "@/utils";
import { query } from "@/utils/query";
import { EditTask } from "@/components";
import type { FC } from "react";
import type { IFolderFromList } from "@/services/wrike/types";
import { Settings } from "@/types";

const EditTaskPage: FC = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<unknown, Settings>();
  const { asyncErrorHandler } = useAsyncError();
  const { task, isLoading } = useTask(taskId);
  const [error, setError] = useState<string|null>(null);

  const onCancel = useCallback(() => {
    navigate(`/issues/view/${task?.id}`);
  }, [navigate, task]);

  const onSubmit = useCallback((_: IFolderFromList["id"], values: object) => {
    if (!client || !context?.settings || !taskId) {
      return Promise.resolve();
    }

    setError(null);

    return editTask(client, taskId, values, context?.settings)
      .then(() => query.invalidateQueries())
      .then(() => navigate(`/tasks/${taskId}`))
      .catch((err) => {
        const msg = getError(err);
        if (msg) {
          setError(msg);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, context?.settings, taskId, navigate, asyncErrorHandler]);

  useSetTitle("Edit Task");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
  });

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <EditTask
      task={task}
      error={error}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export { EditTaskPage };
