import type { Settings as ContextSettings } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

export type RequestParams = {
  endpoint: string,
  method: RequestMethod,
  data?: unknown,
  settings?: ContextSettings,
};

export type IWrikeResponse<T> = {
  kind: string;
  data: T;
};
export interface IWorkflow {
  id: string;
  name: string;
  standard: boolean;
  hidden: boolean;
  customStatuses?: CustomStatus[];
}

export interface CustomStatus {
  id: string;
  name: string;
  standardName: boolean;
  color: string;
  standard: boolean;
  group: string;
  hidden: boolean;
}

export interface INote {
  id: string;
  authorId: string;
  text: string;
  updatedDate: string;
  createdDate: string;
  taskId: string;
}

export interface IAccount {
  createdDate: string; // "2024-08-05T08:42:17Z"
  dateFormat: string;
  firstDayOfWeek: string;
  id: string;
  joinedDate: string; // "2024-08-05T08:42:17Z"
  name: string;
  workDays: string[];
}

export interface ICustomField {
  id: string;
  accountId: IAccount["id"];
  title: string;
  type: string;
  spaceId: string;
  sharedIds: any[];
  settings: Settings;
  value?: string;
}

export interface Settings {
  inheritanceType: string;
  decimalPlaces?: number;
  useThousandsSeparator?: boolean;
  currency?: string;
  aggregation?: string;
  readOnly: boolean;
  values?: string[];
  options?: Option[];
  optionColorsEnabled?: boolean;
  allowOtherValues?: boolean;
  contacts?: string[];
}

export interface Option {
  value: string;
  color: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  profiles: Profile[];
  avatarUrl: string;
  timezone: string;
  locale: string;
  deleted: boolean;
  me: boolean;
  title: string;
  companyName: string;
  phone: string;
  primaryEmail: string;
}

export interface Profile {
  accountId: IAccount["id"];
  email: string;
  role: string;
  external: boolean;
  admin: boolean;
  owner: boolean;
}

export interface IFolderFromList {
  id: string;
  title: string;
  childIds: string[];
  scope: string;
}

export interface ITask {
  id: string;
  accountId: IAccount["id"];
  title: string;
  description: string;
  briefDescription: string;
  parentIds: string[];
  superParentIds: any[];
  sharedIds: string[];
  responsibleIds: string[];
  status: string;
  importance: string;
  createdDate: string;
  updatedDate: string;
  dates: Dates;
  scope: string;
  authorIds: string[];
  customStatusId: string;
  hasAttachments: boolean;
  permalink: string;
  priority: string;
  followedByMe: boolean;
  followerIds: string[];
  superTaskIds: any[];
  subTaskIds: any[];
  dependencyIds: string[];
  metadata: any[];
  customFields: CustomFieldTask[];
  customFieldsData?: Record<string, string>;
}

export interface CustomFieldTask {
  id: string;
  value: string;
}

export interface Dates {
  type: string;
  duration: number;
  start: string;
  due: string;
}

export interface ITaskFromList {
  id: string;
  accountId: IAccount["id"];
  title: string;
  status: string;
  importance: string;
  createdDate: string;
  updatedDate: string;
  completedDate: string;
  dates: Dates;
  scope: string;
  customStatusId: string;
  permalink: string;
  priority: string;
}

export interface Dates {
  type: string;
  duration: number;
  start: string;
  due: string;
}
