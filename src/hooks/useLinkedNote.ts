import { useCallback, useState } from "react";
import { useDeskproAppClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { createNote } from "@/services/wrike";
import type { Settings, TaskType } from "@/types";
import type { ITaskFromList, INote } from "@/services/wrike/types";

export type Result = {
  isLoading: boolean,
  addLinkNote: (task: ITaskFromList|TaskType) => Promise<INote|null>,
  addUnlinkNote: (task: ITaskFromList|TaskType) => Promise<INote|null>,
};

const getHTMLLink = (link: string) => {
  return `<a href="${link}">${link}</a>`;
};

const getLinkedMessage = (ticketId: string, link?: string): string => {
  return `Linked to Deskpro ticket ${ticketId}${link ? `, ${getHTMLLink(link)}` : ""}`
};

const getUnlinkedMessage = (ticketId: string, link?: string): string => {
  return `Unlinked from Deskpro ticket ${ticketId}${link ? `, ${getHTMLLink(link)}` : ""}`
};

const useLinkedNote = (): Result => {
  const { client } = useDeskproAppClient();
  const { context } = useDeskproLatestAppContext<{ticket: {id: string; permalinkUrl: string}}, Settings>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const settings = context?.settings;
  const isEnable = context?.settings?.add_comment_when_linking ?? false;
  const ticketId = context?.data?.ticket.id;
  const permalink = context?.data?.ticket.permalinkUrl;

  const addLinkNote = useCallback((task: ITaskFromList|TaskType) => {
    if (!client || !isEnable || !settings || !task?.id || !ticketId) {
      return Promise.resolve(null);
    };

    setIsLoading(true);

    return createNote(
      client,
      task.id,
      getLinkedMessage(ticketId, permalink),
      settings,
    ).finally(() => setIsLoading(false));
  }, [client, isEnable, ticketId, permalink, settings]);

  const addUnlinkNote = useCallback((task: ITaskFromList|TaskType) => {
    if (!client || !isEnable || !settings || !task?.id || !ticketId) {
      return Promise.resolve(null);
    };

    setIsLoading(true)
    return createNote(
      client,
      task.id,
      getUnlinkedMessage(ticketId, permalink),
      settings,
    ).finally(() => setIsLoading(false));
  }, [client, isEnable, ticketId, permalink, settings]);

  return { isLoading, addLinkNote, addUnlinkNote };
};

export {
  useLinkedNote,
  getLinkedMessage,
  getUnlinkedMessage,
};
