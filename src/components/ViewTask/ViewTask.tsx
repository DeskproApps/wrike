import { HorizontalDivider } from "@deskpro/app-sdk";
import { Container } from "@/components/common";
import { Details, CustomFieldsView, SubItems, Notes } from "./blocks";
import type { FC } from "react";
import type { TaskType, NoteType } from "@/types";
import type { ITaskFromList } from "@/services/wrike/types";

type Props = {
  task: TaskType;
  notes: NoteType[];
  subItems: ITaskFromList[];
  onNavigateToAddNote: () => void;
};

const ViewTask: FC<Props> = ({ task, notes, subItems, onNavigateToAddNote }) => {
  return (
    <>
      <Container>
        <Details task={task}/>
        <CustomFieldsView fields={task?.customFields} />
      </Container>

      <HorizontalDivider/>

      <Container>
        <SubItems subItems={subItems} />
      </Container>

      <HorizontalDivider/>

      <Container>
        <Notes notes={notes} onNavigateToAddNote={onNavigateToAddNote} />
      </Container>
    </>
  );
};

export { ViewTask };
