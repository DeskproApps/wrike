import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import type { ITaskFromList } from "@/services/wrike/types";

const useBadgeCount = (items: ITaskFromList[]) => {
  useInitialisedDeskproAppClient((client) => {
    client.setBadgeCount(items?.length ?? 0);
  }, [items]);
};

export { useBadgeCount };
