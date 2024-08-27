import { useNavigate } from "react-router-dom";
import { TwoButtonGroup } from "@deskpro/app-sdk";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { MutateTask } from "../../components/Mutate/Task";
import { Stack } from "@deskpro/deskpro-ui";

export const FindOrCreate = () => {
  const navigate = useNavigate();

  return (
    <Stack vertical>
      <Stack style={{ alignSelf: "center" }}>
        <TwoButtonGroup
          selected={"two"}
          oneIcon={faMagnifyingGlass}
          twoIcon={faPlus}
          oneLabel="Find Task⠀⠀"
          twoLabel="Create Task⠀⠀"
          oneOnClick={() => navigate("/tasks/link")}
          twoOnClick={() => {}}
        ></TwoButtonGroup>
      </Stack>

      <MutateTask />
    </Stack>
  );
};
