import { z } from "zod";
import {
  validationSchema,
  validationSchemaCustomForm,
} from "./utils";
import type {
  UseFormStateReturn,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import type { TaskType } from "@/types";
import type { ITask, ICustomField, IFolderFromList } from "@/services/wrike/types";

export type FormValidationSchema = z.infer<typeof validationSchema>;

export type CustomFormValidationSchema = z.infer<typeof validationSchemaCustomForm>;

export type Props = {
  onSubmit: (folder: IFolderFromList["id"], values: object) => Promise<void|ITask>,
  onCancel: () => void,
  error: string|string[]|null,
  isEditMode?: boolean,
  task?: TaskType,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CustomFieldProps<T extends Record<string, any> = Record<string, any>> = {
  field: ICustomField,
  formControl: {
    field: ControllerRenderProps<T>,
    fieldState: ControllerFieldState,
    formState: UseFormStateReturn<T>,
  },
};
