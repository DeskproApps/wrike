import { Fragment } from "react";
import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, NotFound, TaskItem } from "@/components/common";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

type Props = {
  tasks: ITaskFromList[];
  onNavigateToTask: (task: ITaskFromList) => void;
};

const Home: FC<Props> = ({ tasks, onNavigateToTask }) => {
  return (
    <Container>
      {(tasks?.length === 0) ? (
        <NotFound text="No tasks found" />
      ) : tasks.map((task) => (
        <Fragment key={task.id}>
          <TaskItem task={task} onClickTitle={() => onNavigateToTask(task)} />
          <HorizontalDivider style={{ marginBottom: 14 }}/>
        </Fragment>
      ))}
    </Container>
  );
};

export { Home };
