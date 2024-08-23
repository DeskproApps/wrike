import {
  LoadingSpinner,
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { Stack } from "@deskpro/deskpro-ui";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCustomFields,
  getNotesByTaskId,
  getTaskById,
  getWorkflows,
} from "@/services/wrike";
import { FieldMapping } from "../../components/FieldMapping/FieldMapping";
import { Notes } from "../../components/Notes/Notes";
import { useLinkTasks, useTicketCount } from "../../hooks/hooks";
import TaskJson from "../../mappings/task.json";
import type { CustomFieldTask, ITask } from "@/services/wrike/types";

export const ViewTask = () => {
  const { taskId } = useParams();
  const { context } = useDeskproLatestAppContext();
  const { unlinkTask } = useLinkTasks();
  const navigate = useNavigate();
  const [task, setTask] = useState<ITask | null>(null);
  const [taskLinkedCount, setTaskLinkedCount] = useState<number>(0);

  const { getTaskTicketCount } = useTicketCount();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Wrike");

    client.deregisterElement("plus");
    client.registerElement("edit", { type: "edit_button" });
    client.registerElement("home", { type: "home_button" });
    client.registerElement("menu", {
      type: "menu",
      items: [{ title: "Unlink task" }]
    });
  }, []);

  useEffect(() => {
    (async () => {
      const taskLinkedCount = await getTaskTicketCount(taskId as string);

      setTaskLinkedCount(taskLinkedCount as number);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTaskTicketCount, taskId]);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "menuButton":
          await unlinkTask(taskId as string);

          navigate("/redirect");

          break;

        case "editButton":
          navigate("/edit/task/" + taskId);

          break;

        case "homeButton":
          navigate("/redirect");
      }
    },
  });

  const tasksByIdQuery = useQueryWithClient(
    ["getTaskById", taskId as string],
    (client) => getTaskById(client, taskId as string, context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) }
  );

  const notesByTaskIdQuery = useQueryWithClient(
    ["notesByTaskId", taskId as string],
    (client) => getNotesByTaskId(client, taskId as string, context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) }
  );

  const customFieldsQuery = useQueryWithClient(
    ["customFields"],
    (client) => getCustomFields(client, context?.settings),
    { enabled: Boolean(taskId) && Boolean(context?.settings) }
  );

  const workflowsQuery = useQueryWithClient(
    ["workflows"],
    (client) => getWorkflows(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  useEffect(() => {
    if (!customFieldsQuery.isSuccess || !tasksByIdQuery.isSuccess) return;

    const customFields = customFieldsQuery.data.data;

    const task = tasksByIdQuery.data.data[0];

    setTask({
      ...task,
      status:
        (workflowsQuery.data?.data[0]?.customStatuses || []).find(
          (e) => e.id === task.customStatusId
        )?.name || "",
      customFields: task.customFields.map((customFieldTask) => {
        const customFieldMeta = customFields.find(
          (customField) => customField.id === customFieldTask.id
        );
        return {
          title: customFieldMeta?.title,
          label: `${customFieldMeta?.type}_customField`,
          value: customFieldTask.value,
          type: `${customFieldMeta?.type}_customField`,
          settings: customFieldMeta?.settings,
        } as unknown as CustomFieldTask;
      }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customFieldsQuery.isSuccess, tasksByIdQuery.isSuccess]);

  const notes = notesByTaskIdQuery.data?.data;

  if (!task || !notesByTaskIdQuery.isSuccess) return <LoadingSpinner />;

  return (
    <Stack vertical gap={10}>
      <FieldMapping
        fields={[
          {
            ...task,
            linked_tickets: taskLinkedCount || 0,
          },
        ]}
        metadata={TaskJson.view}
        childTitleAccessor={(e) => e.title}
        idKey={TaskJson.idKey}
        externalChildUrl={TaskJson.externalUrl}
      />
      <Notes id={taskId as string} notes={notes}></Notes>
    </Stack>
  );
};
