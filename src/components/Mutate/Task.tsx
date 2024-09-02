import {
  useDeskproAppEvents,
  useInitialisedDeskproAppClient,
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { Button, Stack } from "@deskpro/deskpro-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ZodTypeAny, z } from "zod";
import {
  createTask,
  editTask,
  getCustomFields,
  getFolders,
  getTaskById,
  getTasks,
  getUsers,
  getWorkflows,
} from "@/services/wrike";
import { useLinkTasks } from "@/hooks/hooks";
import { useQueryMutationWithClient } from "@/hooks/useQueryWithClient";
import TaskJson from "@/mappings/task.json";
import { getTaskSchema } from "@/schemas";
import { DropdownSelect } from "@/components/DropdownSelect/DropdownSelect";
import { FieldMappingInput } from "@/components/FieldMappingInput/FieldMappingInput";
import { LoadingSpinnerCenter } from "@/components/LoadingSpinnerCenter/LoadingSpinnerCenter";
import { IMPORTANCES } from "@/utils/consts";
import type { ITaskFromList, IWrikeResponse } from "@/services/wrike/types";
import { query } from "@/utils/query";

const inputs = TaskJson.create;

export const MutateTask = ({ id }: { id?: string }) => {
  const navigate = useNavigate();
  const { context } = useDeskproLatestAppContext();
  const [schema, setSchema] = useState<ZodTypeAny | null>(null);
  const { linkTasks } = useLinkTasks();

  const isEditMode = !!id;

  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema as ZodTypeAny),
  });

  const [selectedFolder] = watch(["folder"]);

  useInitialisedDeskproAppClient((client) => {
    client.deregisterElement("plus");
    client.deregisterElement("edit");
  });

  useDeskproAppEvents({
    async onElementEvent(id) {
      switch (id) {
        case "home":
          navigate("/redirect");

          break;
      }
    },
  });

  const submitMutation = useQueryMutationWithClient((client, data) => {
    if (!context?.settings) {
      return Promise.resolve();
    }

    return (async () => {
      const task = await isEditMode
        ? editTask(client, id as string, data, context?.settings)
        : createTask(client, watch("folder"), data, context?.settings); //change

      await query.invalidateQueries();
      return task;
    })();
  });

  const taskQuery = useQueryWithClient(
    ["task", id as string],
    (client) => getTaskById(client, id as string, context?.settings),
    { enabled: isEditMode && Boolean(context?.settings) }
  );

  const foldersQuery = useQueryWithClient(
    ["folders"],
    (client) => getFolders(client, context?.settings),
    { enabled: !isEditMode && Boolean(context?.settings) }
  );

  const workflowsQuery = useQueryWithClient(
    ["workflows"],
    (client) => getWorkflows(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const tasksQuery = useQueryWithClient(
    ["tasks"],
    (client) => getTasks(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const usersQuery = useQueryWithClient(
    ["users"],
    (client) => getUsers(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const customFieldsQuery = useQueryWithClient(
    ["customFields"],
    (client) => getCustomFields(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  useEffect(() => {
    if (!id || !taskQuery.isSuccess) return;

    const task = taskQuery.data.data[0];

    reset({
      title: task.title,
      customStatus: task.customStatusId,
      importance: task.importance,
      folder: task.parentIds[0],
      start_date: task.dates?.start,
      due_date: task.dates?.due,
      ...task.customFields.reduce(
        (a, c) => ({
          ...a,
          [`${c.id}_customField`]: c.value,
        }),
        {}
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskQuery.isSuccess, id, reset]);

  useEffect(() => {
    if (!submitMutation.isSuccess) return;

    const id = submitMutation.data?.data[0]?.id;

    (async () => {
      !isEditMode && (await linkTasks([id as string]));

      navigate(!id ? "/redirect" : `/view/task/${id}`);
    })();
  }, [
    submitMutation.isSuccess,
    navigate,
    linkTasks,
    id,
    submitMutation.data,
    isEditMode,
  ]);

  useEffect(() => {
    if (inputs.length === 0) return;

    const newObj: { [key: string]: ZodTypeAny } = {};

    inputs.forEach((field) => {
      if (["responsibles", "description"].includes(field.name) && isEditMode)
        return;
      if (field.required) {
        newObj[field.name] = z.string().nonempty();
      } else if (field.multiple) {
        newObj[field.name] = z.array(z.string()).optional();
      } else {
        newObj[field.name] = z.string().optional();
      }
    });

    setSchema(
      getTaskSchema(
        inputs.filter((e) =>
          !isEditMode ? true : !["responsibles", "description"].includes(e.name)
        ),
        newObj
      )
    );
  }, [isEditMode]);

  const folders = useMemo(() => {
    if (!foldersQuery.isSuccess) return [];

    const boardsPath = foldersQuery.data?.data;

    return boardsPath.map((folder) => ({
      key: folder.title,
      value: folder.id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foldersQuery.isSuccess]);

  const users = useMemo(() => {
    if (!usersQuery.isSuccess) return [];

    const usersPath = usersQuery.data?.data;

    return usersPath?.map((user) => ({
      key: `${user.firstName} ${user.lastName}`,
      value: user.id.toString(),
    }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usersQuery.isSuccess]);

  const statuses = useMemo(() => {
    if (!workflowsQuery.isSuccess) return [];

    const statusesPath = workflowsQuery.data?.data[0]?.customStatuses || [];

    return statusesPath.map((status) => ({
      key: status.name,
      value: status.id,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowsQuery]);

  const dropdownData = useMemo(() => {
    if (
      !usersQuery.isSuccess ||
      !tasksQuery.isSuccess ||
      !workflowsQuery.isSuccess
    )
      return {};

    return {
      customStatus: statuses,
      importance: IMPORTANCES.map((importance) => ({
        key: importance,
        value: importance,
      })),
      responsibles: users,
      parents: (tasksQuery.data as IWrikeResponse<ITaskFromList[]>).data.map(
        (task) => ({
          key: task.title,
          value: task.id,
        })
      ),
      ...customFieldsQuery.data?.data
        .filter((e) => e.type === "DropDown")
        .reduce(
          (a, c) => ({
            ...a,
            [`${c.id}_customField`]: c.settings.options?.map((option) => ({
              key: option.value,
              value: option.value,
            })),
          }),
          {}
        ),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    usersQuery.isSuccess,
    customFieldsQuery.isSuccess,
    tasksQuery.isSuccess,
    workflowsQuery.isSuccess,
  ]);

  if (
    (!isEditMode && !foldersQuery.isSuccess) ||
    (isEditMode && !taskQuery.isSuccess) ||
    !usersQuery.isSuccess ||
    !customFieldsQuery.isSuccess ||
    !tasksQuery.isSuccess
  )
    return <LoadingSpinnerCenter />;

  return (
    <form
      onSubmit={handleSubmit((data) => submitMutation.mutate(data))}
      style={{ width: "100%" }}
    >
      <Stack vertical style={{ width: "100%" }} gap={6}>
        {!isEditMode && (
          <DropdownSelect
            title="Folder"
            error={!!errors.folder}
            onChange={(e) => setValue("folder", e)}
            required={true}
            data={folders}
            value={watch("folder")}
          />
        )}
        {selectedFolder && (
          <>
            <FieldMappingInput
              errors={errors}
              fields={[
                ...inputs.filter((e) =>
                  !isEditMode
                    ? true
                    : !["responsibles", "description"].includes(e.name)
                ),
                ...(customFieldsQuery.data?.data.map((customField) => ({
                  name: `${customField.id}_customField`,
                  label: customField.title,
                  type: customField.type.toLowerCase(),
                })) ?? []),
              ]}
              register={register}
              setValue={setValue}
              watch={watch}
              dropdownData={dropdownData}
            />
            <Stack style={{ width: "100%", justifyContent: "space-between" }}>
              <Button
                type="submit"
                data-testid="button-submit"
                text={id ? "Save" : "Create"}
                loading={!submitMutation.isIdle}
                disabled={!submitMutation.isIdle}
                intent="primary"
              ></Button>
              {!!id && (
                <Button
                  text="Cancel"
                  onClick={() => navigate(`/view/task/${id}`)}
                  intent="secondary"
                ></Button>
              )}
            </Stack>
          </>
        )}
      </Stack>
    </form>
  );
};
