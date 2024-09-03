import { Search, HorizontalDivider } from "@deskpro/app-sdk";
import { Container, Navigation } from "@/components/common";
import { Buttons, Tasks } from "./blocks";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

type Props = {
  isLoading: boolean;
  onCancel: () => void;
  isSubmitting: boolean;
  tasks: ITaskFromList[];
  onLinkTasks: () => void;
  selectedTasks: ITaskFromList[];
  onNavigateToCreate: () => void;
  onChangeSearchQuery: (search: string) => void,
  onChangeSelectedTask: (task: ITaskFromList) => void;
};

const LinkTasks: FC<Props> = ({
  tasks,
  onCancel,
  isLoading,
  onLinkTasks,
  isSubmitting,
  selectedTasks,
  onNavigateToCreate,
  onChangeSearchQuery,
  onChangeSelectedTask,
}) => {
  return (
    <>
      <Container>
        <Navigation onNavigateToCreate={onNavigateToCreate} />
        <Search
          isFetching={isLoading}
          onChange={onChangeSearchQuery}
          inputProps={{ placeholder: "Enter Task Title" }}
        />
        <Buttons
          onCancel={onCancel}
          onLinkTasks={onLinkTasks}
          isSubmitting={isSubmitting}
          selectedTasks={selectedTasks}
        />
      </Container>
      <HorizontalDivider/>
      <Container>
        <Tasks
          tasks={tasks}
          isLoading={isLoading}
          selectedTasks={selectedTasks}
          onChangeSelectedTask={onChangeSelectedTask}
        />
      </Container>
    </>
  );
};

export { LinkTasks };
