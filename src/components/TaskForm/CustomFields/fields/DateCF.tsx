import { DateInput } from "@deskpro/app-sdk";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const DateCF: FC<CustomFieldProps> = ({ field, formControl }) => {
  return (
    <DateInput
      id={field.id}
      error={false}
      placeholder="DD/MM/YYYY"
      value={formControl.field.value as Date}
      onChange={(date: Date[]) => formControl.field.onChange(date[0])}
    />
  );
};

export { DateCF };
