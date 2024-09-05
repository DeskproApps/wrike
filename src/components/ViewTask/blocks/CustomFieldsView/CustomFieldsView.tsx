import { Property } from "@deskpro/app-sdk";
import { CustomField } from "./CustomField";
import type { FC } from "react";
import type { TaskType } from "@/types";

type Props = {
  fields?: TaskType["customFields"];
};

const CustomFieldsView: FC<Props> = ({ fields = [] }) => {
  if (!fields) {
    return (<></>);
  }

  return (
    <>
      {fields.map((field) => (
        <Property
          key={field.meta.id}
          label={field.meta.title}
          text={<CustomField field={field} />}
        />
      ))}
    </>
  );
};

export { CustomFieldsView };
