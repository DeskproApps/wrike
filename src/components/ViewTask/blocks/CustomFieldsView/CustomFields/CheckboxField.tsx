import { Toggle } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const CheckboxField: FC<Props> = ({ value }) => (
  <Toggle checked={value.value === "true"} onChange={(() => {})}/>
);

export { CheckboxField };
