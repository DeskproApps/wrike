import { P5 } from "@deskpro/deskpro-ui";
import { format } from "@/utils/date";
import { NoValue } from "./NoValue";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const DateField: FC<Props> = ({ value }) => {
  const date = format(value.value);

  return date ? <P5>{date}</P5> : <NoValue/>;
};

export { DateField };
