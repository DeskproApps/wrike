import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container, Navigation } from "@/components/common";
import { Buttons, Tasks } from "./blocks";
import type { FC } from "react";

type Props = {
  onNavigateToCreate: () => void;
};

const LinkTasks: FC<Props> = ({ onNavigateToCreate }) => {
  return (
    <>
      <Container>
        <Navigation onNavigateToCreate={onNavigateToCreate} />
        <Buttons/>
      </Container>
      <HorizontalDivider/>
      <Tasks/>
    </>
  );
};

export { LinkTasks };
