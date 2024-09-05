import { Toggle } from "@deskpro/deskpro-ui";
import { NoValue } from "./NoValue";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const CheckboxField: FC<Props> = ({ value }) => {
  return !value.value
    ? (<NoValue/>)
    : (
      <Toggle checked={value.value === "true"} onChange={(() => {})}/>
    );
};

export { CheckboxField };
