import {
  LoadingSpinner,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
} from "@deskpro/app-sdk";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useLinkTasks, useTicketCount } from "../hooks/hooks";
import { FieldMapping } from "../components/FieldMapping/FieldMapping";
import TaskJson from "../mappings/task.json";
import { Stack } from "@deskpro/deskpro-ui";
import { getTasksByIds, getWorkflows } from "../api/api";
import { Container } from "../components/common";

export const Main = () => {
  const { context } = useDeskproLatestAppContext();
  const navigate = useNavigate();
  const [tasksIds, setTaskIds] = useState<string[]>([]);
  const [taskLinketCount, setTaskLinkedCount] = useState<
    Record<string, number>
  >({});
  const { getLinkedTasks, unlinkAllTasks } = useLinkTasks();
  const { getMultipleTasksTicketCount } = useTicketCount();

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Wrike");

    client.deregisterElement("homeButton");

    client.deregisterElement("menuButton");

    client.registerElement("plusButton", {
      type: "plus_button",
    });

    client.deregisterElement("editButton");

    client.registerElement("refreshButton", {
      type: "refresh_button",
    });
  }, []);

  useInitialisedDeskproAppClient(
    (client) => {
      client.setBadgeCount(tasksIds.length);
    },
    [tasksIds]
  );

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "plusButton":
          navigate("/findOrCreate");
          break;
      }
    },
  });
  const tasksByIdsQuery = useQueryWithClient(
    ["getTasksById"],
    (client) => getTasksByIds(client, tasksIds, context?.settings),
    {
      enabled: !!tasksIds.length && Boolean(context?.settings),
      onError: (error: { message: string }) => {
        try {
          const errorData = JSON.parse(error.message);

          if (errorData.status === 400) {
            unlinkAllTasks().then(() => {
              navigate("/redirect");
            });
          }
        } catch (e) {
          null;
        }
      },
    }
  );

  const workflowsQuery = useQueryWithClient(
    ["workflows"],
    (client) => getWorkflows(client, context?.settings),
    { enabled: Boolean(context?.settings) }
  );

  useEffect(() => {
    if (!tasksByIdsQuery.error) return;
  }, [tasksByIdsQuery.error]);

  useInitialisedDeskproAppClient(() => {
    (async () => {
      if (!context) return;

      const linkedTasks = await getLinkedTasks();

      if (!linkedTasks || linkedTasks.length === 0) {
        navigate("/findOrCreate");

        return;
      }

      setTaskIds(linkedTasks);

      const tasksLinkedCount = await getMultipleTasksTicketCount(linkedTasks);

      setTaskLinkedCount(tasksLinkedCount);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  const tasks = useMemo(() => {
    if (!tasksByIdsQuery.isSuccess || !workflowsQuery) return [];

    const tasksNoStatus = tasksByIdsQuery.data?.data;

    const workflows = workflowsQuery.data?.data[0];

    return tasksNoStatus?.map((task) => ({
      ...task,
      status: workflows?.customStatuses?.find(
        (status) => status.id === task.customStatusId
      )?.name,
    }));
  }, [tasksByIdsQuery, workflowsQuery]);

  if (!tasksByIdsQuery.isSuccess || !taskLinketCount) return <LoadingSpinner />;

  return (
    <Container>
      <Stack vertical style={{ width: "100%" }}>
        <FieldMapping
          fields={tasks.map((e) => ({
            ...e,
            linked_tickets: taskLinketCount[e.id] || 0,
          }))}
          metadata={TaskJson.link}
          idKey={TaskJson.idKey}
          internalChildUrl={`/view/task/`}
          externalChildUrl={TaskJson.externalUrl}
          childTitleAccessor={(e) => e.title}
        />
      </Stack>
    </Container>
  );
};
