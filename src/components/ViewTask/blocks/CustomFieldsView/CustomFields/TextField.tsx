import { P5 } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const TextField: FC<Props> = ({ value }) => {
  return (
    <P5>{value.value}</P5>
  );
};

export { TextField };
