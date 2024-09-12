import { useMemo } from "react";
import { Select } from "@deskpro/app-sdk";
import { getOption } from "@/utils";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const DropDownCF: FC<CustomFieldProps> = ({ field, formControl }) => {
  const value = formControl.field.value || "";
  const options = useMemo(() => {
    return (field.settings?.options ?? []).map(({ value }) => getOption(value));
  }, [field.settings?.options]);

  return (
    <Select
      id={field.id}
      initValue={value}
      options={options}
      onChange={formControl.field.onChange}
    />
  );
};

export { DropDownCF };
