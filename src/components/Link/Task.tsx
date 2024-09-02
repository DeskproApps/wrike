import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
  useDeskproLatestAppContext,
  HorizontalDivider,
} from "@deskpro/app-sdk";
import { AnyIcon, Button, Checkbox, Input, Stack } from "@deskpro/deskpro-ui";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "@/hooks";
import { useLinkTasks, useTicketCount } from "@/hooks/hooks";
import TaskJson from "@/mappings/task.json";
import { Title } from "@/styles";
import { FieldMapping } from "@/components/FieldMapping/FieldMapping";
import { LoadingSpinnerCenter } from "@/components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import { getTasksByPrompt, getWorkflows } from "@/services/wrike";
import { ButtonAsLink } from "@/components/common";
import type { ITask } from "@/services/wrike/types";

export const LinkTask = () => {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [linkedTasks, setLinkedTasks] = useState<string[]>([]);
  const [taskLinketCount, setTaskLinkedCount] = useState<
    Record<string, number>
  >({});
  const [prompt, setPrompt] = useState<string>("");
  const { getLinkedTasks, linkTasks } = useLinkTasks();
  const { getMultipleTasksTicketCount } = useTicketCount();
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();

  const onSelectTask = useCallback((task: ITask) => {
    if (selectedTasks.includes(task.id)) {
      setSelectedTasks(
        selectedTasks.filter((e) => e !== task.id)
      );
    } else {
      setSelectedTasks([...selectedTasks, task.id]);
    }
  }, [selectedTasks]);

  const { debouncedValue: debouncedText } = useDebounce(prompt, 300);

  useInitialisedDeskproAppClient((client) => {
    client.setTitle("Link Task");

    client.deregisterElement("plus");
    client.registerElement("home", { type: "home_button" });
  }, []);

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "home":
          navigate("/redirect");
      }
    },
  });

  const tasksQuery = useQueryWithClient(
    ["getTasks", debouncedText],
    (client) => getTasksByPrompt(client, debouncedText, context?.settings),
    {
      enabled: debouncedText.length > 2 && Boolean(context?.settings),
      onSuccess: async (data) => {
        const linkedTasksFunc = await getLinkedTasks();

        if (!linkedTasksFunc) return;

        const linkedTasksIds = data.data
          .filter((task) => linkedTasksFunc.includes(task.id))
          .map((e) => e.id);

        const linkedTaskTickets = await getMultipleTasksTicketCount(
          linkedTasksIds
        );

        setLinkedTasks([...linkedTasks, ...linkedTasksIds]);

        setTaskLinkedCount({
          ...taskLinketCount,
          ...linkedTaskTickets,
        });
      },
    }
  );

  const workflowsQuery = useQueryWithClient(
    ["workflows"],
    (client) => getWorkflows(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const tasks = useMemo(() => {
    if (!tasksQuery.isSuccess || !workflowsQuery) return [];

    const tasksNoStatus = tasksQuery.data?.data;

    const workflows = workflowsQuery.data?.data[0];

    return tasksNoStatus?.map((task) => ({
      ...task,
      status: workflows?.customStatuses?.find(
        (status) => status.id === task.customStatusId
      )?.name,
    }));
  }, [tasksQuery, workflowsQuery]);

  return (
    <Stack gap={10} style={{ width: "100%" }} vertical>
      <Stack vertical gap={6} style={{ width: "100%" }}>
        <Input
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
          placeholder="Enter Task Title"
          type="text"
          leftIcon={faMagnifyingGlass as AnyIcon}
        />
        <Stack vertical style={{ width: "100%" }} gap={5}>
          <Stack
            style={{ width: "100%", justifyContent: "space-between" }}
            gap={5}
          >
            <Button
              onClick={() => linkTasks(selectedTasks)}
              disabled={selectedTasks.length === 0}
              text="Link Task"
            ></Button>
            <Button
              disabled={selectedTasks.length === 0}
              text="Cancel"
              intent="secondary"
              onClick={() => setSelectedTasks([])}
            ></Button>
          </Stack>
          <HorizontalDivider />
        </Stack>
        {tasksQuery.isFetching ? (
          <LoadingSpinnerCenter />
        ) : tasksQuery.isSuccess &&
          Array.isArray(tasks) &&
          tasks?.length !== 0 ? (
          <Stack vertical gap={5} style={{ width: "100%" }}>
            {tasks?.map((task, i) => {
              return (
                <Stack key={i} gap={6} style={{ width: "100%" }}>
                  <Stack style={{ marginTop: "2px" }}>
                    <Checkbox
                      checked={selectedTasks.includes(task.id)}
                      onChange={() => onSelectTask(task as unknown as ITask)}
                    ></Checkbox>
                  </Stack>
                  <Stack style={{ width: "92%" }}>
                    <FieldMapping
                      fields={[
                        {
                          ...task,
                          linked_tickets: taskLinketCount[task.id] || "0",
                        },
                      ]}
                      hasCheckbox={true}
                      metadata={TaskJson.link}
                      idKey={TaskJson.idKey}
                      externalChildUrl={TaskJson.externalUrl}
                      childTitleAccessor={(e) => (
                        <ButtonAsLink type="button" onClick={() => onSelectTask(task as unknown as ITask)}>
                          {e.title}
                        </ButtonAsLink>
                      ) as unknown as string}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        ) : (
          tasksQuery.isSuccess && <Title>No Tasks Found.</Title>
        )}
      </Stack>
    </Stack>
  );
};
