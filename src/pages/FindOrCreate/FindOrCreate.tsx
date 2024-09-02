import { TwoButtonGroup } from "@deskpro/app-sdk";
import { useState } from "react";
import { faMagnifyingGlass, faPlus } from "@fortawesome/free-solid-svg-icons";
import { LinkTask } from "@/components/Link/Task";
import { MutateTask } from "@/components/Mutate/Task";
import { Container } from "@/components/common";

export const FindOrCreate = ({ pageParam }: { pageParam?: 0 | 1 }) => {
  const [page, setPage] = useState<0 | 1>(pageParam || 0);

  return (
    <Container>
      <TwoButtonGroup
        selected={
          {
            0: "one",
            1: "two",
          }[page] as "one" | "two"
        }
        oneIcon={faMagnifyingGlass}
        twoIcon={faPlus}
        oneLabel="Find Task⠀⠀"
        twoLabel="Create Task⠀⠀"
        oneOnClick={() => setPage(0)}
        twoOnClick={() => setPage(1)}
      />
      {
        {
          0: <LinkTask />,
          1: <MutateTask />,
        }[page]
      }
    </Container>
  );
};
