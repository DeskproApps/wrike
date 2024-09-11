import { Title, Property } from "@deskpro/app-sdk";
import { WrikeLogo, DPNormalize, DeskproTickets } from "@/components/common";
import { format } from "@/utils/date";
import type { FC } from "react";
import type { TaskType } from "@/types";

export type Props = {
  task: TaskType;
};

const Details: FC<Props> = ({ task }) => {
  return (
    <>
      <Title
        title={task?.title}
        icon={<WrikeLogo/>}
        link={task?.permalink}
      />
      <Property
        label="Description"
        text={<DPNormalize text={task?.description} />}
      />

      <Property label="Status" text={task?.status}/>

      <Property label="Importance" text={task?.importance}/>

      <Property label="Scope" text={task?.scope}/>

      <Property label="Start Date" text={format(task?.dates?.start, { date: true, time: true })}/>

      <Property label="Due Date" text={format(task?.dates?.due, { date: true, time: true })}/>

      <Property label="Linked Tickets" text={<DeskproTickets entityId={task?.id}/>}/>
    </>
  );
};

export { Details };
