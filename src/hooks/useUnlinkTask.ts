import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDeskproAppClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { deleteEntityService } from "@/services/deskpro";
import { useAsyncError } from "./useAsyncError";
import { useLinkedNote } from "./useLinkedNote";
import type { TaskType } from "@/types";

export type Result = {
  isLoading: boolean,
  unlink: (task: TaskType) => void,
};

const useUnlinkTask = (): Result => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { asyncErrorHandler } = useAsyncError();
  const { addUnlinkNote } = useLinkedNote();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const ticketId = context?.data?.ticket.id;

  const unlink = useCallback((task: TaskType) => {
    if (!client || !task?.id || !ticketId) {
      return;
    }

    setIsLoading(true);

    return Promise.all([
      deleteEntityService(client, ticketId, task.id),
      addUnlinkNote(task),
    ])
      .then(() => navigate("/home"))
      .catch(asyncErrorHandler)
      .finally(() => setIsLoading(false));
  }, [client, ticketId, navigate, asyncErrorHandler, addUnlinkNote]);

  return { isLoading, unlink };
};

export { useUnlinkTask };
