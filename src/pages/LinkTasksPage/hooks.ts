import {
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getTasksByPrompt } from "@/services/wrike";
import { QueryKey } from "@/utils/query";
import type { ITaskFromList } from "@/services/wrike/types";
import { Settings } from "@/types";

type UseSearch = (q: string) => {
  isLoading: boolean;
  tasks: ITaskFromList[];
};

const useSearch: UseSearch = (q: string) => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();

  const searchTasks = useQueryWithClient(
    [QueryKey.TASKS, q],
    (client) => getTasksByPrompt(client, q, context?.settings),
    { enabled: q.length > 2 && Boolean(context?.settings) },
  );

  return {
    isLoading:searchTasks.isLoading && Boolean(q),
    tasks: searchTasks.data?.data ?? [],
  }
};

export { useSearch };
