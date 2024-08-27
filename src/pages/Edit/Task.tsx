import { useParams } from "react-router-dom";
import { MutateTask } from "../../components/Mutate/Task";
import { Container } from "../../components/common";

export const EditTask = () => {
  const { taskId } = useParams();

  if (!taskId) return <div />;

  return (
    <Container>
      <MutateTask id={taskId} />
    </Container>
  );
};
