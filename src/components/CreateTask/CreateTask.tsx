import { Navigation, Container } from "@/components/common";
import { TaskForm } from "@/components/TaskForm";
import type { FC } from "react";
import type { Props as FormProps } from "@/components/TaskForm";

type Props = FormProps & {
  onNavigateToLink: () => void;
};

const CreateTask: FC<Props> = ({ onNavigateToLink, ...props }) => {
  return (
    <Container>
      <Navigation onNavigateToLink={onNavigateToLink}/>
      <TaskForm {...props}/>
    </Container>
  );
};

export { CreateTask };
