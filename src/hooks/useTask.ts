import { enhanceTask, enhanceNote } from "@/utils";
import { getCustomFields, getNotesByTaskId, getTaskById, getTasksByIds, getUsersByIds, getWorkflows } from "@/services/wrike";
import { QueryKey } from "@/utils/query";
import { useMemo } from "react";
import { useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import type { ITask, ITaskFromList, INote, IUser } from "@/services/wrike/types";
import type { Settings, TaskType } from "@/types";

type UseTask = (taskId?: ITask["id"]) => {
  isLoading: boolean;
  notes: INote[];
  task: TaskType;
  subItems: ITaskFromList[];
};

const useTask: UseTask = (taskId) => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();

  const tasksByIdQuery = useQueryWithClient(
    [QueryKey.TASK, taskId as ITask["id"]],
    (client) => getTaskById(client, taskId as ITask["id"], context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) },
  );

  const subTaskIds = tasksByIdQuery.data?.data[0]?.subTaskIds ?? [];

  const subTask = useQueryWithClient(
    [QueryKey.TASK, ...subTaskIds as Array<ITask["id"]>],
    (client) => getTasksByIds(client, subTaskIds, context?.settings),
    { enabled: (subTaskIds.length > 0) && Boolean(context?.settings) },
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
      tasksByIdQuery,
      notesByTaskIdQuery,
      customFieldsQuery,
      workflowsQuery,
      // Exclude subtask here if there are no ids because subtask.isLoading
      // will always be true
      ...(subTaskIds.length > 0 ? [subTask] : [])
    ].some(({ isLoading }) => isLoading),
    task,
    notes,
    subItems: subTask.data?.data ?? [],
  };
}

export { useTask };
