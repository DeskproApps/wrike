import { Toggle } from "@deskpro/deskpro-ui";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const CheckboxCF: FC<CustomFieldProps> = ({ formControl }) => {

  return (
    <Toggle
      checked={Boolean(formControl.field.value)}
      onChange={() => formControl.field.onChange(!formControl.field.value)}
    />
  );
};

export { CheckboxCF };
