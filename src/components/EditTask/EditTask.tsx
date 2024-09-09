import { Container } from "@/components/common";
import type { FC } from "react";
import { TaskForm, type Props as FormProps } from "@/components/TaskForm";

const EditTask: FC<FormProps> = (props) => {
  return (
    <Container>
      <TaskForm isEditMode {...props} />
    </Container>
  );
};

export { EditTask };
