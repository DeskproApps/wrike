import { Fragment } from "react";
import { Checkbox } from "@deskpro/deskpro-ui";
import { LoadingSpinner, HorizontalDivider } from "@deskpro/app-sdk";
import { Card, NotFound, TaskItem } from "@/components/common";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

export type Props = {
  isLoading: boolean;
  tasks: ITaskFromList[];
  selectedTasks: ITaskFromList[];
  onChangeSelectedTask: (task: ITaskFromList) => void;
};

const Tasks: FC<Props> = ({
  tasks,
  isLoading,
  selectedTasks,
  onChangeSelectedTask,
}) => {
  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <>
      {(tasks?.length === 0)
        ? <NotFound text="No tasks found" />
        : tasks.map((task) => (
          <Fragment key={task.id}>
            <Card>
              <Card.Media>
                <Checkbox
                  size={12}
                  containerStyle={{ marginTop: 4 }}
                  onChange={() => onChangeSelectedTask(task)}
                  checked={selectedTasks.some((selectedTask) => {
                    return task.id === selectedTask.id;
                  })}
                />
              </Card.Media>
              <Card.Body>
                <TaskItem task={task} onClickTitle={() => onChangeSelectedTask(task)} />
              </Card.Body>
            </Card>
            <HorizontalDivider style={{ marginBottom: 14 }}/>
          </Fragment>
        ))
      }
    </>
  );
};

export { Tasks };
