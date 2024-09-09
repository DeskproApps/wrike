import { z } from "zod";
import { P, match } from "ts-pattern";
import { toHTML, toMarkdown } from "@/utils";
import { IMPORTANCES, CustomFieldsMap } from "@/constants";
import type { TaskType } from "@/types";
import type { ICustomField, CustomFieldTask } from "@/services/wrike/types";
import type { FormValidationSchema, CustomFormValidationSchema } from "./types";

const validationSchema = z.object({
  folder: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  importance: z.string(),
  dueDate: z.date().optional(),
  startDate: z.date().optional(),
  assignee: z.array(z.string()),
  isEditMode: z.string().optional(),
});

const validationSchemaCustomForm = z.object({});

const getDefaultInitValues = (task?: TaskType): FormValidationSchema => {
  return {
    folder: (task?.parentIds ?? [])[0] || "",
    title: task?.title || "",
    description: toMarkdown(task?.description || ""),
    importance: task?.importance || IMPORTANCES[1],
    startDate: task?.dates?.start ? (new Date(task.dates.start)) : undefined,
    dueDate: task?.dates?.due ? (new Date(task.dates.due)) : undefined,
    assignee: task?.responsibleIds || [],
  };
};

const getCustomInitValues = (
  customFields?: TaskType["customFields"],
): CustomFormValidationSchema => {
  return (customFields ?? []).reduce<Record<CustomFieldTask["id"], unknown>>((acc, { meta, value }) => {
    const data = match(meta.type)
      .with(P.union(
        CustomFieldsMap.Text,
        CustomFieldsMap.Numeric,
        CustomFieldsMap.Currency,
        CustomFieldsMap.Duration,
        CustomFieldsMap.DropDown,
        CustomFieldsMap.Percentage,
      ), () => value.value)
      .with(CustomFieldsMap.Checkbox, () => (value.value === "true"))
      .with(CustomFieldsMap.Date, () => value.value ? (new Date(value.value)) : undefined)
      .with(CustomFieldsMap.Multiple, () => {
        try {
          return JSON.parse(value.value);
        } catch (e) {
          return [];
        }
      })
      .with(CustomFieldsMap.Contacts, () => value.value ? value.value.split(",") : [])
      .otherwise(() => null);

    if (data) {
      acc[value.id] = data;
    }

    return acc;
  }, {});
};

const getDefaultTaskValues = (values: FormValidationSchema) => {
  return {
    title: values.title,
    description: toHTML(values.description),
    importance: values.importance,
    dates: {
      type: "Planned",
      start: values.startDate?.toISOString().split("T")[0],
      due: values.dueDate?.toISOString().split("T")[0],
    },
    ...(values.isEditMode === "true" ? {} : { responsibles: values.assignee }),
  };
};

const getFolderFromValues = (values: FormValidationSchema) => {
  return values.folder;
};

const getCustomTaskValues = (
  values: CustomFormValidationSchema,
  customFields: ICustomField[],
) => {
  const data = Object.keys(values).map((fieldId: string) => {
    const field = customFields.find(({ id }) => fieldId === id);
    const value = values[fieldId as keyof CustomFormValidationSchema];
    return match(field?.type)
      .with(P.union(
        CustomFieldsMap.Text,
        CustomFieldsMap.Numeric,
        CustomFieldsMap.Currency,
        CustomFieldsMap.DropDown,
        CustomFieldsMap.Duration,
        CustomFieldsMap.Percentage,
      ), () => ({ id: fieldId, value: value || "" }))
      .with(CustomFieldsMap.Multiple, () => ({ id: fieldId, value: value ? JSON.stringify(value) : "" }))
      .with(CustomFieldsMap.Date, () => ({ id: fieldId, value: (value as Date)?.toISOString().split("T")[0] || "" }))
      .with(CustomFieldsMap.Checkbox, () => ({ id: fieldId, value: `${Boolean(value)}` }))
      .with(CustomFieldsMap.Contacts, () => ({ id: fieldId, value: (value as [])?.join(",") || "" }))
      .otherwise(() => null);
  }).filter(Boolean);

  return {
    customFields: data,
  };
};

export {
  validationSchema,
  validationSchemaCustomForm,
  getDefaultInitValues,
  getCustomInitValues,
  getDefaultTaskValues,
  getCustomTaskValues,
  getFolderFromValues,
};
