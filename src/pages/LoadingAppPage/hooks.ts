import { useNavigate } from "react-router-dom";
import {
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { getEntityListService } from "@/services/deskpro";
import { checkAuthService } from "@/services/wrike";
import { useAsyncError } from "@/hooks";
import { Settings } from "@/types";
import { LOG_IN_TYPE_STATE, logInTypes } from '@/constants';

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

    client.setUserState(LOG_IN_TYPE_STATE, context.settings.use_access_token ? logInTypes.ACCESS_TOKEN : logInTypes.OAUTH2);

    checkAuthService(client, settings)
      .then(() => getEntityListService(client, ticketId))
      .then((entityIds) => navigate(entityIds?.length ? "/home" : "/tasks/link"))
      .catch(error => {
        asyncErrorHandler(error);

        navigate('/log_in');
      });
  }, [navigate, ticketId, settings, asyncErrorHandler]);
};

export { useLoadingApp };