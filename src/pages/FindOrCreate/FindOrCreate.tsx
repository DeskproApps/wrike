import { useNavigate } from "react-router-dom";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Container } from "@/components/common";
import { MutateTask } from "../../components/Mutate/Task";

export const FindOrCreate = () => {
  const navigate = useNavigate();

  return (
    <Container>
      <TwoButtonGroup
        selected={"two"}
        oneIcon={faMagnifyingGlass}
        twoIcon={faPlus}
        oneLabel="Find Task"
        twoLabel="Create Task"
        oneOnClick={() => navigate("/tasks/link")}
        twoOnClick={() => {}}
      />
      <MutateTask />
    </Container>
  );
};
