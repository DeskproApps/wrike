import { useMemo } from "react";
import { Select } from "@deskpro/app-sdk";
import { getOption } from "@/utils";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const MultipleCF: FC<CustomFieldProps> = ({ field, formControl }) => {
  const options = useMemo(() => {
    return (field.settings?.options ?? []).map(({ value }) => getOption(value));
  }, [field.settings?.options]);

  return (
    <Select
      id={field.id}
      initValue={formControl.field.value}
      options={options}
      closeOnSelect={false}
      onChange={formControl.field.onChange}
    />
  );
};

export { MultipleCF };
