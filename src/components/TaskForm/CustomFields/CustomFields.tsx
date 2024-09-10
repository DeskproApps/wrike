import { Controller } from "react-hook-form";
import { map } from "./map";
import { Label } from "../../common";
import type { FC } from "react";
import type { Control } from "react-hook-form";
import type { ICustomField } from "@/services/wrike/types";
import type { CustomFormValidationSchema } from "../types";

type Props = {
  control: Control<CustomFormValidationSchema>,
  customFields: ICustomField[],
};

const CustomFields: FC<Props> = ({ control, customFields }) => (
  <>
    {customFields.map((field) => {
      const fieldId = field.id;
      const fieldName = field.title;
      const CustomField = map(field);

      if (!CustomField) {
        // eslint-disable-next-line no-console
        console.warn(`Could not render field view, mapping missing for Space field type ${field.type}`);
        return null;
      }

      const customField = (
        <Controller
          name={fieldId as never}
          control={control}
          render={(formControl) => (
            <CustomField field={field} formControl={formControl as never} />
          )}
        />
      );

      return (
        <Label renderAs="div" key={fieldId} id={fieldId} label={fieldName}>
          {customField}
        </Label>
      );
    })}
  </>
);

export { CustomFields };
