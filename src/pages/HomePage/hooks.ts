import { useMemo } from "react";
import {
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getEntityListService } from "@/services/deskpro";
import { getTasksByIds } from "@/services/wrike";
import { QueryKey } from "@/utils/query";
import type { DPTicket } from "@/types";
import type { ITaskFromList } from "@/services/wrike/types";

type UseTasks = () => {
  isLoading: boolean;
  tasks: ITaskFromList[];
};

const useTasks: UseTasks = () => {
  const { context } = useDeskproLatestAppContext();
  const ticketId = context?.data?.ticket.id;

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_TASKS, ticketId as DPTicket["id"]],
    (client) => getEntityListService(client, ticketId as DPTicket["id"]),
    { enabled: Boolean(ticketId) },
  );

  const taskIds = useMemo(() => linkedIds.data || [], [linkedIds.data]);

  const tasks = useQueryWithClient(
    [QueryKey.TASKS, ...taskIds],
    (client) => getTasksByIds(client, taskIds, context?.settings),
    { enabled: taskIds.length > 0 && Boolean(context?.settings) }
  );

  return {
    isLoading: [linkedIds, tasks].some(({ isLoading }) => isLoading),
    tasks: tasks.data?.data ?? [],
  };
};

export { useTasks };
