import { useMemo } from "react";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import {
  getTaskById,
  getWorkflows,
  getUsersByIds,
  getCustomFields,
  getNotesByTaskId,
} from "@/services/wrike";
import { enhanceTask, enhanceNote } from "@/utils";
import { QueryKey } from "@/utils/query";
import type { ITask, INote, IUser } from "@/services/wrike/types";
import type { TaskType } from "@/types";

type UseTask = (taskId?: ITask["id"]) => {
  isLoading: boolean;
  notes: INote[];
  task: TaskType;
};

const useTask: UseTask = (taskId) => {
  const { context } = useDeskproLatestAppContext();

  const tasksByIdQuery = useQueryWithClient(
    [QueryKey.TASK, taskId as ITask["id"]],
    (client) => getTaskById(client, taskId as ITask["id"], context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) }
  );

  const notesByTaskIdQuery = useQueryWithClient(
    [QueryKey.NOTES, taskId as ITask["id"]],
    (client) => getNotesByTaskId(client, taskId as ITask["id"], context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) }
  );

  const customFieldsQuery = useQueryWithClient(
    [QueryKey.CUSTOM_FIELDS],
    (client) => getCustomFields(client, context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) }
  );

  const workflowsQuery = useQueryWithClient(
    [QueryKey.WORKFLOWS],
    (client) => getWorkflows(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const task = useMemo(() => enhanceTask(
    tasksByIdQuery.data?.data[0],
    workflowsQuery.data?.data[0],
    customFieldsQuery.data?.data,
  ), [tasksByIdQuery.data, workflowsQuery.data, customFieldsQuery.data]);

  const userIds = useMemo(() => {
    return (notesByTaskIdQuery.data?.data ?? [])
      .map((n) => n.authorId)
      .filter(Boolean)
      .reduce<Array<IUser["id"]>>((acc, userId) => {
        if (!acc.includes(userId)) {
          acc.push(userId);
        }
        return acc;
      }, []);
  }, [notesByTaskIdQuery.data?.data]);

  const users = useQueryWithClient(
    [QueryKey.CONTACTS, ...userIds],
    (client) => getUsersByIds(client, userIds, context?.settings),
    { enabled: userIds.length > 0 && Boolean(context?.settings) },
  );

  const notes = useMemo(() => {
    return (notesByTaskIdQuery.data?.data ?? []).map((n) => enhanceNote(n, users.data?.data ?? []));
  }, [notesByTaskIdQuery.data?.data, users.data?.data]);

  return {
    isLoading: Boolean(taskId) && [
      users,
      tasksByIdQuery,
      notesByTaskIdQuery,
      customFieldsQuery,
      workflowsQuery
    ].some(({ isLoading }) => isLoading),
    task,
    notes,
  };
}

export { useTask };
