import { map } from "./map";
import { NoValue } from "./CustomFields";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = { field: CustomFieldType };

const CustomField: FC<Props> = (props) => {
  const customField = props.field;
  const field = map(customField);

  if (!field) {
    // eslint-disable-next-line no-console
    console.warn(`Could not render field view, mapping missing for Wrike field type ${customField.meta.type}`);
    return (<NoValue />)
  }

  return (
    <>{field}</>
  );
};

export { CustomField };
