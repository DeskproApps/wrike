import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { setEntityService } from "@/services/deskpro";
import {
  useSetTitle,
  useReplyBox,
  useLinkedNote,
  useAsyncError,
  useRegisterElements,
} from "@/hooks";
import { LinkTasks } from "@/components";
import { useSearch } from "./hooks";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";
import { Settings, TicketData } from '@/types';

const LinkTasksPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<TicketData, Settings>();
  const { asyncErrorHandler } = useAsyncError();
  const { addLinkNote } = useLinkedNote();
  const { setSelectionState } = useReplyBox();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTasks, setSelectedTasks] = useState<ITaskFromList[]>([]);
  const { isLoading, tasks } = useSearch(searchQuery);
  const ticketId = context?.data?.ticket.id;

  const onChangeSearchQuery = useDebouncedCallback(setSearchQuery, 500);

  const onNavigateToCreate = useCallback(() => navigate("/tasks/create"), [navigate]);

  const onCancel = useCallback(() => navigate("/home"), [navigate]);

  const onChangeSelectedTask = useCallback((task: ITaskFromList) => {
    let newSelectedTasks = [...selectedTasks];

    if (selectedTasks.some((selectedTask) => task.id === selectedTask.id)) {
      newSelectedTasks = selectedTasks.filter((selectedTask) => {
        return selectedTask.id !== task.id;
      });
    } else {
      newSelectedTasks.push(task);
    }

    setSelectedTasks(newSelectedTasks);
  }, [selectedTasks]);

  const onLinkTasks = useCallback(() => {
    if (!client || !context?.settings || !ticketId || !selectedTasks.length) {
      return;
    }

    setIsSubmitting(true);
    Promise.all([
      ...selectedTasks.map((task) => setEntityService(client, ticketId, task.id)),
      ...selectedTasks.map((task) => addLinkNote(task)),
      ...selectedTasks.map((task) => setSelectionState(task.id, true, "email")),
      ...selectedTasks.map((task) => setSelectionState(task.id, true, "note")),
    ])
      .then(() => navigate("/home"))
      .catch(asyncErrorHandler)
      .finally(() => setIsSubmitting(false));
  }, [client, context, ticketId, selectedTasks, navigate, asyncErrorHandler, addLinkNote, setSelectionState]);

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
    <LinkTasks
      tasks={tasks}
      onCancel={onCancel}
      isLoading={isLoading}
      onLinkTasks={onLinkTasks}
      isSubmitting={isSubmitting}
      selectedTasks={selectedTasks}
      onNavigateToCreate={onNavigateToCreate}
      onChangeSearchQuery={onChangeSearchQuery}
      onChangeSelectedTask={onChangeSelectedTask}
    />
  );
};

export { LinkTasksPage };