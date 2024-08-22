import { useCallback } from "react";
import { Title, TwoProperties } from "@deskpro/app-sdk";
import { format } from "@/utils/date";
import { WrikeLogo, ButtonAsLink, DeskproTickets } from "@/components/common";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

type Props = {
  task: ITaskFromList;
  onClickTitle?: () => void,
};

const TaskItem: FC<Props> = ({ task, onClickTitle }) => {
  const onClick = useCallback(() => {
    onClickTitle && onClickTitle();
  }, [onClickTitle]);

  return (
    <>
      <Title
        title={!onClickTitle
          ? task.title
          : (
            <ButtonAsLink type="button" onClick={onClick}>
              {task.title}
            </ButtonAsLink>
          )
        }
        link={task.permalink}
        icon={<WrikeLogo/>}
        marginBottom={0}
      />
      <TwoProperties
        leftLabel="Status"
        leftText={task.status}
        rightLabel="Importance"
        rightText={task.importance}
      />
      <TwoProperties
        leftLabel="Due Date"
        leftText={format(task.dates.due)}
        rightLabel="Linked Tickets"
        rightText={<DeskproTickets entityId={task.id} />}
      />
    </>
  );
};

export { TaskItem };
