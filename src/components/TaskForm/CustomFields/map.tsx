import { P, match } from "ts-pattern";
import { CustomFieldsMap } from "@/constants";
import {
  TextCF,
  DateCF,
  NumericCF,
  DropDownCF,
  CheckboxCF,
  MultipleCF,
  ContactsFC,
  CurrencyCF,
  PercentageCF,
} from "./fields";
import type { ICustomField } from "@/services/wrike/types";

const map = (field: ICustomField) => {
  return match(field.type)
    .with(P.union(
      CustomFieldsMap.Text,
      CustomFieldsMap.Duration,
    ), () => TextCF)
    .with(CustomFieldsMap.Numeric, () => NumericCF)
    .with(CustomFieldsMap.Percentage, () => PercentageCF)
    .with(CustomFieldsMap.Currency, () => CurrencyCF)
    .with(CustomFieldsMap.Checkbox, () => CheckboxCF)
    .with(CustomFieldsMap.Date, () => DateCF)
    .with(CustomFieldsMap.DropDown, () => DropDownCF)
    .with(CustomFieldsMap.Multiple, () => MultipleCF)
    .with(CustomFieldsMap.Contacts, () => ContactsFC)
    .otherwise(() => null);
};

export { map };
