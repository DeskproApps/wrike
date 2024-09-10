import { Input } from "@/components/common";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const TextCF: FC<CustomFieldProps> = ({ formControl }) => {
  const { field: formControlField } = formControl;

  return (
    <Input {...formControlField} />
  );
};

export { TextCF };
