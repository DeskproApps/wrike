import React from "react";
import { match, P } from "ts-pattern";
import {
  TextField,
  DateField,
  CurrencyField,
  DurationField,
  CheckboxField,
  ContactsField,
  DropDownField,
  MultipleField,
  PercentageField,
} from "./CustomFields";
import { CustomFieldsMap } from "@/constants";
import type { ReactNode } from "react";
import type { CustomFieldType } from "@/types";

const map = (props: CustomFieldType): ReactNode => {
  return match(props.meta.type)
    .with(P.union(
      CustomFieldsMap.Text,
      CustomFieldsMap.Numeric,
    ), () => <TextField {...props}/>)
    .with(CustomFieldsMap.Currency, () => <CurrencyField {...props}/>)
    .with(CustomFieldsMap.Percentage, () => <PercentageField {...props}/>)
    .with(CustomFieldsMap.Duration, () => <DurationField {...props}/>)
    .with(CustomFieldsMap.Date, () => <DateField {...props}/>)
    .with(CustomFieldsMap.Checkbox, () => <CheckboxField {...props}/>)
    .with(CustomFieldsMap.Contacts, () => <ContactsField {...props}/>)
    .with(CustomFieldsMap.DropDown, () => <DropDownField {...props}/>)
    .with(CustomFieldsMap.Multiple, () => <MultipleField {...props}/>)
    .otherwise(() => null);
}

export { map };
