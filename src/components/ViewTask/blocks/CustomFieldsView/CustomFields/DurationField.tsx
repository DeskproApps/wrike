import { P5 } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const DurationField: FC<Props> = ({ value }) => {
  const duration = [];
  const [hour, minutes] = value.value.split(":").map(Number);

  if (hour) {
    duration.push(`${hour}h`)
  }

  if (minutes) {
    duration.push(`${minutes}m`);
  }

  return (
    <P5>{duration.join(" ")}</P5>
  );
};

export { DurationField };
