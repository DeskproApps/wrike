import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { setEntityService } from "@/services/deskpro";
import { createTask } from "@/services/wrike";
import { useSetTitle, useRegisterElements, useAsyncError, useLinkedNote } from "@/hooks";
import { getError } from "@/utils";
import { CreateTask } from "@/components";
import type { FC } from "react";
import type { IFolderFromList } from "@/services/wrike/types";
import { Settings } from "@/types";

const CreateTaskPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<{ticket: {id: string}}, Settings>();
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkNote } = useLinkedNote();
  const [error, setError] = useState<string|string[]|null>(null);
  const ticketId = context?.data?.ticket.id;

  const onNavigateToLink = useCallback(() => navigate("/tasks/link"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onSubmit = useCallback((folder: IFolderFromList["id"], values: object) => {
    if (!client || !context?.settings || !ticketId) {
      return Promise.resolve();
    }

    setError(null);

    return createTask(client, folder, values, context.settings)
      .then((res) => {
        const task = res.data[0];
        return Promise.all([
          setEntityService(client, ticketId, task.id),
          addLinkNote(task),
        ]);
      })
      .then(() => navigate("/home"))
      .catch((err) => {
        const msg = getError(err);
        if (msg) {
          setError(msg);
        } else {
          asyncErrorHandler(err);
        }
      });
  }, [client, context?.settings, navigate, asyncErrorHandler, ticketId, addLinkNote]);

  useSetTitle("Link Tasks");

  useRegisterElements(({ registerElement }) => {
    const isUsingOAuth = context?.settings.use_access_token === false || context?.settings.use_advanced_connect === false

    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
    });
    isUsingOAuth && registerElement('menu', {
      type: 'menu',
      items: [
        {
          title: 'Log Out',
          payload: {
            type: 'logOut'
          }
        }
      ]
    });
  });

  return (
    <CreateTask
      error={error}
      onCancel={onCancel}
      onSubmit={onSubmit}
      onNavigateToLink={onNavigateToLink}
    />
  );
};

export { CreateTaskPage };