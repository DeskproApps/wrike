import { Tag } from "@/components/common";
import { NoValue } from "./NoValue";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const DropDownField: FC<Props> = ({ value }) => {
  if (!value.value) {
    return (
      <NoValue/>
    );
  }

  return (
    <Tag tag={value.value}/>
  );
};

export { DropDownField };
