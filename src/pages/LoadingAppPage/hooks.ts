import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityListService } from "@/services/deskpro";
import { checkAuthService } from "@/services/wrike";
import { useAsyncError } from "@/hooks";
import { Settings } from "@/types";

type UseLoadingApp = () => void;

const useLoadingApp: UseLoadingApp = () => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext<{ticket: {id: string}}, Settings>();
  const { asyncErrorHandler } = useAsyncError();
  const ticketId = context?.data?.ticket.id;
  const settings = context?.settings;

  useInitialisedDeskproAppClient((client) => {
    if (!ticketId || !settings) {
      return;
    }

    checkAuthService(client, settings)
      .then(() => getEntityListService(client, ticketId))
      .then((entityIds) => navigate(entityIds?.length ? "/home" : "/tasks/link"))
      .catch(asyncErrorHandler)
  }, [navigate, ticketId, settings, asyncErrorHandler]);
};

export { useLoadingApp };
