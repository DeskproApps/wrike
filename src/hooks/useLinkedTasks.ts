import {
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { useLocation } from 'react-router-dom';
import { getEntityListService } from "@/services/deskpro";
import { getTasksByIds } from "@/services/wrike";
import { QueryKey } from "@/utils/query";
import type { DPTicket, Settings } from "@/types";
import type { ITaskFromList, IWrikeResponse } from "@/services/wrike/types";

type UseLinkedTasks = () => {
  isLoading: boolean;
  tasks: ITaskFromList[];
};

const useLinkedTasks: UseLinkedTasks = () => {
  const { context } = useDeskproLatestAppContext<{ ticket: { id: string } }, Settings>();
  const location = useLocation();
  const ticketId = context?.data?.ticket.id;

  const isOnLogInPage = location.pathname === '/log_in';

  const linkedIds = useQueryWithClient(
    [QueryKey.LINKED_TASKS, ticketId as DPTicket["id"]],
    (client) => getEntityListService(client, ticketId as DPTicket["id"]),
    { enabled: Boolean(ticketId) && !isOnLogInPage },
  );

  const taskIds = linkedIds.data || [];

  const tasks = useQueryWithClient<IWrikeResponse<ITaskFromList[]>>(
    [QueryKey.TASKS, ...taskIds],
    (client) => {
      return getTasksByIds(client, taskIds, context?.settings).catch(() => ({
        kind: "",
        data: []
      }));
    },
    { enabled: taskIds.length > 0 && Boolean(context?.settings) && !isOnLogInPage }
  );

  return {
    isLoading: [linkedIds, tasks].some(({ isLoading }) => isLoading) && !linkedIds,
    tasks: tasks.data?.data ?? [],
  };
};

export { useLinkedTasks };
