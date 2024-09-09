import { Input } from "@/components/common";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const NumericCF: FC<CustomFieldProps> = ({ formControl }) => {
  const { field: formControlField } = formControl;

  return (
    <Input
      type="number"
      variant="inline"
      inputsize="small"
      placeholder="Add value"
      {...formControlField}
    />
  );
};

export { NumericCF };
