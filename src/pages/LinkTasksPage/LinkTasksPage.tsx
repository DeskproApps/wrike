import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDebouncedCallback } from "use-debounce";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { setEntityService } from "@/services/deskpro";
import { useSetTitle, useRegisterElements, useAsyncError } from "@/hooks";
import { LinkTasks } from "@/components";
import { useSearch } from "./hooks";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

const LinkTasksPage: FC = () => {
  const navigate = useNavigate();
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext();
  const { asyncErrorHandler } = useAsyncError();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [selectedTasks, setSelectedTasks] = useState<ITaskFromList[]>([]);
  const { isLoading, tasks } = useSearch(searchQuery);
  const ticketId = context?.data?.ticket.id;

  const onChangeSearchQuery = useDebouncedCallback(setSearchQuery, 500);

  const onNavigateToCreate = useCallback(() => navigate("/findOrCreate"), [navigate]);

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
      ...selectedTasks.map((task) => setEntityService(client, ticketId, task.id))
    ])
      .then(() => navigate("/home"))
      .catch(asyncErrorHandler)
      .finally(() => setIsSubmitting(false));
  }, [client, context, ticketId, selectedTasks, navigate, asyncErrorHandler]);

  useSetTitle("Link Tasks");

  useRegisterElements(({ registerElement }) => {
    registerElement("refresh", { type: "refresh_button" });
    registerElement("home", {
      type: "home_button",
      payload: { type: "changePage", path: "/home" },
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
