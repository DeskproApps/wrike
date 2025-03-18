import type { To } from "react-router-dom";
import type { DropdownValueType } from "@deskpro/deskpro-ui";
import type { Context } from "@deskpro/app-sdk";
import type {
  IUser,
  INote,
  ITask,
  CustomStatus,
  ICustomField,
  CustomFieldTask,
} from "@/services/wrike/types";

/** Common types */
export type Option<Value = unknown> = Omit<DropdownValueType<Value>, "subItems">;

/** Format: yyyy-MM-dd'T'HH:mm:ss ('T'HH:mm:ss is optional) */
export type DateTime = string;

/** Deskpro types */
export type Settings = {
  use_deskpro_saas?: string;
  use_access_token?: boolean;
  instance_url?: string;
  access_token?: string;
  client_id?: string;
  add_comment_when_linking?: boolean;
  default_comment_on_ticket_note?: boolean;
  default_comment_on_ticket_reply?: boolean;
};

export type DPTicket = {
  id: string,
  subject: string,
  permalinkUrl: string,
};

export type TicketData = {
  ticket: DPTicket,
};

export type TicketContext = Context<TicketData, Settings>;

export type NavigateToChangePage = { type: "changePage", path: To };

export type UnlinkPayload = { type: "unlink", task: TaskType };

export type LogOutPayload = {type: 'logOut'};

export type EventPayload =
  | NavigateToChangePage
  | UnlinkPayload
  | LogOutPayload;

export type CustomFieldType = {
  meta: ICustomField
  value: CustomFieldTask,
};

export type TaskType = Partial<Omit<ITask, "status"|"customFields"> & {
  status: CustomStatus["name"]|undefined;
  customFields: CustomFieldType[];
}>;

export type NoteType = INote & {
  author?: IUser;
};