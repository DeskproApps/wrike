import { Tags } from "@/components/common";
import { NoValue } from "./NoValue";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const MultipleField: FC<Props> = ({ value }) => {
  let tags: string[] = [];

  try {
    tags = JSON.parse(value.value);
  } catch (e) {
    // do nothing
  }

  return (tags?.length > 0)
    ? <Tags tags={tags}/>
    : <NoValue/>
};

export { MultipleField };
