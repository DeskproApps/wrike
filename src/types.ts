import type { To } from "react-router-dom";
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

/** Format: yyyy-MM-dd'T'HH:mm:ss ('T'HH:mm:ss is optional) */
export type DateTime = string;

/** Deskpro types */
export type Settings = {
  instance_url?: string;
  access_token?: string;
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

export type EventPayload =
  | NavigateToChangePage
;

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
