import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@deskpro/deskpro-ui";
import {
  Select,
  DateInput,
  LoadingSpinner,
} from "@deskpro/app-sdk";
import {
  Label,
  Input,
  Button,
  TextArea,
  FieldHint,
  ErrorBlock,
} from "@/components/common";
import { useFormDeps } from "./hooks";
import {
  validationSchema,
  getCustomInitValues,
  getCustomTaskValues,
  getFolderFromValues,
  getDefaultTaskValues,
  getDefaultInitValues,
} from "./utils";
import { CustomFields } from "./CustomFields";
import type { FC } from "react";
import type { IUser } from "@/services/wrike/types";
import type {
  Props,
  FormValidationSchema,
  CustomFormValidationSchema,
} from "./types";

const TaskForm: FC<Props> = ({
  task,
  error,
  onSubmit,
  onCancel,
  isEditMode,
}) => {
  const {
    isLoading,
    customFields,
    folderOptions,
    assigneeOptions,
    importanceOptions,
  } = useFormDeps();
  const [isSubmitting, setIsSubmitting] = useState<boolean>();
  const defaultForm = useForm<FormValidationSchema>({
    defaultValues: getDefaultInitValues(task),
    resolver: zodResolver(validationSchema),
  });
  const customForm = useForm<CustomFormValidationSchema>({
    defaultValues: getCustomInitValues(task?.customFields),
    shouldUnregister: true,
  });

  const onClickSubmit = useCallback(async () => {
    const isValid = await defaultForm.trigger();

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    onSubmit(getFolderFromValues(defaultForm.getValues()), {
      ...getDefaultTaskValues(defaultForm.getValues()),
      ...getCustomTaskValues(customForm.getValues(), customFields),
    }).finally(() => setIsSubmitting(false));
  }, [onSubmit, defaultForm, customForm, customFields]);

  if (isLoading) {
    return (
      <LoadingSpinner/>
    );
  }

  return (
    <>
      {error && <ErrorBlock texts={[error]}/>}

      <input type="hidden" value={`${isEditMode}`} {...defaultForm.register("isEditMode")} />

      <Label htmlFor="folder" label="Folder">
        <Select
          id="folder"
          disabled={isEditMode}
          options={folderOptions}
          initValue={defaultForm.watch("folder")}
          error={Boolean(defaultForm.formState.errors.folder?.message)}
          onChange={(value) => defaultForm.setValue("folder", value as string)}
        />
      </Label>

      <Label htmlFor="title" label="Title" required>
        <Input
          id="title"
          error={Boolean(defaultForm.formState.errors.title?.message)}
          {...defaultForm.register("title")}
        />
      </Label>

      <Label htmlFor="description" label="Description">
        <TextArea
          id="description"
          error={Boolean(defaultForm.formState.errors.description?.message)}
          {...defaultForm.register("description")}
        />
        <FieldHint>Markdown formatting is supported</FieldHint>
      </Label>

      {/* "name": "customStatus", "label": "Status", "type": "dropdown" */}

      <Label htmlFor="importance" label="Importance">
        <Select
          id="importance"
          options={importanceOptions}
          initValue={defaultForm.watch("importance")}
          error={Boolean(defaultForm.formState.errors.importance?.message)}
          onChange={(value) => defaultForm.setValue("importance", value as string)}
        />
      </Label>

      <Label htmlFor="assignee" label="Assignee">
        <Select<IUser["id"]>
          id="assignee"
          showInternalSearch
          closeOnSelect={false}
          disabled={isEditMode}
          options={assigneeOptions}
          initValue={defaultForm.watch("assignee")}
          error={Boolean(defaultForm.formState.errors.assignee?.message)}
          onChange={(value) => defaultForm.setValue("assignee", value as Array<IUser["id"]>)}
        />
      </Label>

      <Label htmlFor="startDate" label="Start Date">
        <DateInput
          id="startDate"
          placeholder="DD/MM/YYYY"
          value={defaultForm.watch("startDate") as Date}
          error={Boolean(defaultForm.formState.errors.startDate?.message)}
          onChange={(date: Date[]) => defaultForm.setValue("startDate", date[0])}
        />
      </Label>

      <Label htmlFor="dueDate" label="Due Date">
        <DateInput
          id="due_date"
          placeholder="DD/MM/YYYY"
          value={defaultForm.watch("dueDate") as Date}
          error={Boolean(defaultForm.formState.errors.dueDate?.message)}
          onChange={(date: Date[]) => defaultForm.setValue("dueDate", date[0])}
        />
      </Label>

      <CustomFields
        control={customForm.control}
        customFields={customFields}
      />

      <Stack justify="space-between">
        <Button
          type="button"
          text={isEditMode ? "Save" : "Create"}
          onClick={onClickSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        />

        <Button type="button" text="Cancel" intent="tertiary" onClick={onCancel}/>
      </Stack>
    </>
  );
};

export { TaskForm };
