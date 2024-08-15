import {
  proxyFetch,
  ProxyResponse,
  IDeskproClient,
  V2ProxyRequestInit,
  adminGenericProxyFetch,
} from "@deskpro/app-sdk";
import { BASE_URL } from "../constants";
import {
  ICustomFields,
  IFolderFromList,
  ITask,
  ITaskFromList,
  IUser,
  IWorkflow,
  IWrikeResponse,
  IAccount,
  RequestParams,
} from "./types";
import type { Settings } from "../types";

export const getCustomFields = async (
  client: IDeskproClient,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<ICustomFields[]>> =>
  request(client, { endpoint: `api/v4/customfields`, method: "GET", settings });

export const createNote = async (
  client: IDeskproClient,
  taskId: string,
  comment: string,
  settings: RequestParams["settings"],
) =>
  request(client, {
    endpoint: `api/v4/tasks/${taskId}/comments`,
    method: "POST",
    data: { text: comment },
    settings,
  });

export const getNotesByTaskId = async (
  client: IDeskproClient,
  taskId: string,
  settings: RequestParams["settings"],
) => request(client, {
  endpoint: `api/v4/tasks/${taskId}/comments`,
  method: "GET",
  settings,
});

export const editTask = async (
  client: IDeskproClient,
  taskId: string,
  data: unknown,
  settings: RequestParams["settings"],
) => request(client, {
  endpoint: `api/v4/tasks/${taskId}`,
  method: "PUT",
  data,
  settings,
});

export const createTask = async (
  client: IDeskproClient,
  folderId: string,
  data: unknown,
  settings: RequestParams["settings"],
) => {
  return request(client, {
    endpoint: `api/v4/folders/${folderId}/tasks`,
    method: "POST",
    data,
    settings,
  });
};

export const getUsersByIds = async (
  client: IDeskproClient,
  ids: string[],
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<IUser[]>> =>
  request(client, {
    endpoint: `api/v4/contacts/${ids.join(",")}`,
    method: "GET",
    settings,
  });

export const getUserById = async (
  client: IDeskproClient,
  id: string,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<IUser[]>> =>
  request(client, { endpoint: `api/v4/contacts/${id}`, method: "GET", settings });

export const getUsers = async (
  client: IDeskproClient,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<IUser[]>> =>
  request(client, { endpoint: `api/v4/contacts`, method: "GET", settings });

export const getTasksByPrompt = async (
  client: IDeskproClient,
  prompt: string,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<ITaskFromList[]>> =>
  request(client, {
    endpoint: `api/v4/tasks?title=${encodeURIComponent(
      prompt
    )}&descendants=true&pageSize=1000`,
    method: "GET",
    settings,
  });

export const getWorkflows = async (
  client: IDeskproClient,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<IWorkflow[]>> =>
  request(client, { endpoint: `api/v4/workflows`, method: "GET", settings });

export const getTasks = async (
  client: IDeskproClient,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<ITaskFromList[]>> =>
  request(client, {
    endpoint: `api/v4/tasks?descendants=true&pageSize=1000`,
    method: "GET",
    settings,
  });

export const getTasksByIds = async (
  client: IDeskproClient,
  ids: string[],
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<ITaskFromList[]>> =>
  request(client, {
    endpoint: `api/v4/tasks/${ids.join(",")}`,
    method: "GET",
    settings,
  });

export const getTaskById = async (
  client: IDeskproClient,
  taskId: string,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<ITask[]>> =>
  request(client, {
    endpoint: `api/v4/tasks/${taskId}`,
    method: "GET",
    settings,
  });

export const getTasksByFolderId = async (
  client: IDeskproClient,
  folderId: string,
  settings: RequestParams["settings"],
): Promise<IWrikeResponse<ITask[]>> =>
  request(client, {
    endpoint: `api/v4/folders/${folderId}/tasks`,
    method: "GET",
    settings,
  });

export const getFolders = async (
  client: IDeskproClient,
  settings: RequestParams["settings"],
) => {
  const folderData: IWrikeResponse<IFolderFromList[]> = await request(client, {
    endpoint: "api/v4/folders",
    method: "GET",
    settings,
  });

  return {
    data: folderData.data.filter((folder) => folder.title !== "Recycle Bin"),
  };
};

export const getAccounts = async (
  client: IDeskproClient,
  settings: Settings,
): Promise<IWrikeResponse<IAccount[]>> => {
  return request(client, {
    endpoint: "api/v4/account",
    method: "GET",
    settings,
  });
};

const request = async (
  client: IDeskproClient,
  { endpoint, method, data, settings }: RequestParams,
) => {
  const isAdmin = Boolean(settings?.access_token);
  const url = settings?.instance_url || BASE_URL;
  const accessToken = settings?.access_token || "__access_token__";
  const fetch = await (isAdmin ? adminGenericProxyFetch : proxyFetch)(client);

  const options: V2ProxyRequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${url}/${endpoint}`, options);

  if (isResponseError(response)) {
    throw new Error(
      JSON.stringify({
        status: response.status,
        message: await response.text(),
      })
    );
  }

  const json = await response.json();

  if (json.error) {
    throw new Error(`${json.error} ${json.errorDescription}`);
  }

  return json;
};

export const isResponseError = (response: ProxyResponse) =>
  response.status < 200 || response.status >= 400;
