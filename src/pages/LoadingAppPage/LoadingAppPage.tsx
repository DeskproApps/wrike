import { checkAuthService } from "@/services/wrike";
import { ErrorBlock } from "@/components/common";
import { getEntityListService } from "@/services/deskpro";
import { LoadingSpinner, useDeskproAppClient, useDeskproElements, useDeskproLatestAppContext, useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { LOG_IN_TYPE_STATE, logInTypes } from "@/constants";
import { Settings, TicketData } from "@/types";
import { useNavigate } from "react-router-dom";
import { useState, type FC } from "react";

const LoadingAppPage: FC = () => {
  const { client } = useDeskproAppClient()
  const { context } = useDeskproLatestAppContext<TicketData, Settings>()

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isFetchingAuth, setIsFetchingAuth] = useState<boolean>(true)


  const navigate = useNavigate()

  // Determine authentication method from settings
  const isUsingOAuth = context?.settings.use_access_token === false || context?.settings.use_advanced_connect === false
  const ticketId = context?.data?.ticket.id

  useDeskproElements(({ registerElement, clearElements }) => {
    clearElements()
    registerElement("refresh", { type: "refresh_button" })
  })

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Wrike")

    if (!context || !context?.settings || !ticketId) {
      return
    }

    // Store the authentication method in the user state
    client.setUserState(LOG_IN_TYPE_STATE, isUsingOAuth ? logInTypes.OAUTH2 : logInTypes.ACCESS_TOKEN);

    // Verify authentication status
    // If OAuth2 mode and the user is logged in the request would be make with their stored access token
    // If in access token mode the request would be made with the access token provided in the app setup
    checkAuthService(client, context.settings)
      .then((user) => {
        if (user) {
          setIsAuthenticated(true)
        }
      })
      .catch(() => { })
      .finally(() => {
        setIsFetchingAuth(false)
      })
  }, [context, context?.settings])


  if (!client || !ticketId || isFetchingAuth) {
    return (<LoadingSpinner />)
  }

  if (isAuthenticated) {
    // Redirect the user based on their amount of linked tasks
    getEntityListService(client, ticketId)
      .then((entityIds) => navigate(entityIds.length > 0 ? "/home" : "/tasks/link"))
      .catch(() => { navigate("/tasks/link") });
  } else if (isUsingOAuth) {
    navigate("/log_in");
  } else {
    // Show error for invalid access tokens (expired or not present)
    return (
      <div >
        <ErrorBlock texts={["Invalid Access Token"]} />
      </div>
    );
  }

  return (
    <LoadingSpinner />
  );
};

export { LoadingAppPage };
