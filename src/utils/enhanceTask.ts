import type { TaskType, CustomFieldType } from "@/types";
import type { ITask, IWorkflow, ICustomField } from "@/services/wrike/types";

const enhanceTask = (
  task: ITask|undefined,
  workflow: IWorkflow|undefined,
  customFields: ICustomField[]|undefined,
): TaskType => {
  return {
    ...(task ?? {}),
    status: workflow?.customStatuses?.find(
      (status) => status.id === task?.customStatusId
    )?.name,
    customFields: task?.customFields.map((customFieldTask) => {
      const customFieldMeta = customFields?.find(
        (customField) => customField.id === customFieldTask.id
      );

      return ({
        meta: customFieldMeta,
        value: customFieldTask,
      } as CustomFieldType);
    }),
  };
};

export { enhanceTask };
