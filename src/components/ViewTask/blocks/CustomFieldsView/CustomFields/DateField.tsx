import { P5 } from "@deskpro/deskpro-ui";
import { format } from "@/utils/date";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const DateField: FC<Props> = ({ value }) => (
  <P5>{format(value.value)}</P5>
);

export { DateField };
