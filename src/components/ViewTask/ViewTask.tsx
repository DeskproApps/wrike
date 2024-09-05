import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "@/components/common";
import { Details, CustomFieldsView, Notes } from "./blocks";
import type { FC } from "react";
import type { TaskType, NoteType } from "@/types";

type Props = {
  task: TaskType;
  notes: NoteType[];
  onNavigateToAddNote: () => void;
};

const ViewTask: FC<Props> = ({ task, notes, onNavigateToAddNote }) => {
  return (
    <>
      <Container>
        <Details task={task}/>
        <CustomFieldsView fields={task?.customFields} />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Notes notes={notes} onNavigateToAddNote={onNavigateToAddNote} />
      </Container>
    </>
  );
};

export { ViewTask };
