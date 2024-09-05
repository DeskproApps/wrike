import { Tag } from "@/components/common";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const DropDownField: FC<Props> = ({ value }) => {
  return (
    <Tag tag={value.value}/>
  );
};

export { DropDownField };
