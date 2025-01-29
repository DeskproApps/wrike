import { useCallback, useContext, createContext } from "react";
import { match } from "ts-pattern";
import { useDebouncedCallback } from "use-debounce";
import {
  useDeskproAppClient,
  useDeskproAppEvents,
  useDeskproLatestAppContext,
  useInitialisedDeskproAppClient,
} from "@deskpro/app-sdk";
import { useLinkedTasks } from "./useLinkedTasks";
import { getEntityListService } from "@/services/deskpro";
import { createNote } from "@/services/wrike";
import { query } from "@/utils/query";
import { truncate } from "@/utils";
import { APP_PREFIX } from "@/constants";
import type { FC, PropsWithChildren } from "react";
import type { IDeskproClient, GetStateResponse, TargetAction } from "@deskpro/app-sdk";
import type { ITaskFromList } from "@/services/wrike/types";
import type { Settings, TicketData } from "@/types";

export type ReplyBoxType = "note" | "email";

export type SetSelectionState = (taskId: ITaskFromList["id"], selected: boolean, type: ReplyBoxType) => void|Promise<{ isSuccess: boolean }|void>;

export type GetSelectionState = (taskId: ITaskFromList["id"], type: ReplyBoxType) => void|Promise<Array<GetStateResponse<string>>>;

export type DeleteSelectionState = (taskId: ITaskFromList["id"], type: ReplyBoxType) => void|Promise<boolean|void>;

type ReturnUseReplyBox = {
  setSelectionState: SetSelectionState,
  getSelectionState: GetSelectionState,
  deleteSelectionState: DeleteSelectionState,
};

const noteKey = (ticketId: string, taskId: ITaskFromList["id"]|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/notes/selection/${taskId}`.toLowerCase();
};

const emailKey = (ticketId: string, taskId: ITaskFromList["id"]|"*") => {
  return `tickets/${ticketId}/${APP_PREFIX}/emails/selection/${taskId}`.toLowerCase();
};

const registerReplyBoxNotesAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  taskIds: Array<ITaskFromList["id"]>,
  tasksMap: Record<ITaskFromList["id"], ITaskFromList>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(taskIds) && !taskIds.length) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`);
  }

  return Promise
    .all(taskIds.map((taskId: ITaskFromList["id"]) => client.getState<{ selected: boolean }>(noteKey(ticketId, taskId))))
    .then((flags) => {
      client.registerTargetAction(`${APP_PREFIX}ReplyBoxNoteAdditions`, "reply_box_note_item_selection", {
        title: "Add to Wrike",
        payload: taskIds.map((taskId, idx) => {
          const task = tasksMap[taskId];
          return {
            id: task.id,
            title: truncate(task.title),
            selected: flags[idx][0]?.data?.selected ?? false,
          };
        }),
      });
    })
    ;
};

const registerReplyBoxEmailsAdditionsTargetAction = (
  client: IDeskproClient,
  ticketId: TicketData["ticket"]["id"],
  taskIds: Array<ITaskFromList["id"]>,
  tasksMap: Record<ITaskFromList["id"], ITaskFromList>,
): void|Promise<void> => {
  if (!ticketId) {
    return;
  }

  if (Array.isArray(taskIds) && !taskIds.length) {
    return client.deregisterTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`);
  }

  /**
   * @todo Maybe it might to be optimized. Could this be expensive if we get a lot of taskIds? Instead, can we wait for one to finish before getting the next?
   * const results = [];
   * for (const taskId of taskIds) {
   *   results.push(await client.getState<{ selected: boolean }>(emailKey(ticketId, taskId)))
   * }
   * return results;
   */
  return Promise
    .all(taskIds.map((taskId: ITaskFromList["id"]) => {
      return client.getState<{ selected: boolean }>(emailKey(ticketId, taskId))
    }))
    .then((flags) => {
      return client.registerTargetAction(`${APP_PREFIX}ReplyBoxEmailAdditions`, "reply_box_email_item_selection", {
        title: `Add to Wrike`,
        payload: taskIds.map((taskId, idx) => {
          const task = tasksMap[taskId];
          return {
            id: task.id,
            title: truncate(task.title),
            selected: flags[idx][0]?.data?.selected ?? false,
          };
        }),
      });
    });
};

const ReplyBoxContext = createContext<ReturnUseReplyBox>({
  setSelectionState: () => {},
  getSelectionState: () => {},
  deleteSelectionState: () => {},
});

const useReplyBox = () => useContext<ReturnUseReplyBox>(ReplyBoxContext);

const ReplyBoxProvider: FC<PropsWithChildren> = ({ children }) => {
  const { context } = useDeskproLatestAppContext<{ticket: {id: string}}, Settings>();
  const { client } = useDeskproAppClient();
  const { tasks } = useLinkedTasks();
  const tasksMap = tasks.reduce<Record<ITaskFromList["id"], ITaskFromList>>((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});

  const ticketId = context?.data?.ticket.id;
  const isCommentOnNote = context?.settings?.default_comment_on_ticket_note;
  const isCommentOnEmail = context?.settings?.default_comment_on_ticket_reply;

  const setSelectionState: SetSelectionState = useCallback((taskId, selected, type) => {
    if (!ticketId || !client) {
      return
    }

    if (type === "note" && isCommentOnNote) {
      return client.setState(noteKey(ticketId, taskId), { id: taskId, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((taskIds) => registerReplyBoxNotesAdditionsTargetAction(client, ticketId, taskIds, tasksMap))
        .catch(() => {})
    }

    if (type === "email" && isCommentOnEmail) {
      return client?.setState(emailKey(ticketId, taskId), { id: taskId, selected })
        .then(() => getEntityListService(client, ticketId))
        .then((taskIds) => registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, taskIds, tasksMap))
        .catch(() => {})
    }
  }, [client, ticketId, isCommentOnNote, isCommentOnEmail, tasksMap]);

  const getSelectionState: GetSelectionState = useCallback((taskId, type) => {
    if (!ticketId) {
      return
    }

    const key = (type === "email") ? emailKey : noteKey;
    return client?.getState<string>(key(ticketId, taskId))
  }, [client, ticketId]);

  const deleteSelectionState: DeleteSelectionState = useCallback((taskId, type) => {
    if (!ticketId || !client) {
      return;
    }

    const key = (type === "email") ? emailKey : noteKey;

    return client.deleteState(key(ticketId, taskId))
      .then(() => getEntityListService(client, ticketId))
      .then((taskIds) => {
        const register = (type === "email") ? registerReplyBoxEmailsAdditionsTargetAction : registerReplyBoxNotesAdditionsTargetAction;
        return register(client, ticketId, taskIds, tasksMap);
      })
  }, [client, ticketId, tasksMap]);

  useInitialisedDeskproAppClient((client) => {
    if (isCommentOnNote) {
      registerReplyBoxNotesAdditionsTargetAction(client, `${ticketId}`, tasks.map(({ id }) => id), tasksMap);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxNote`, "on_reply_box_note");
    }

    if (isCommentOnEmail) {
      registerReplyBoxEmailsAdditionsTargetAction(client, `${ticketId}`, tasks.map(({ id }) => id), tasksMap);
      client.registerTargetAction(`${APP_PREFIX}OnReplyBoxEmail`, "on_reply_box_email");
    }
  }, [tasks, ticketId, isCommentOnNote, isCommentOnEmail, tasksMap]);

  const debounceTargetAction = useDebouncedCallback<(a: TargetAction) => void>((action: TargetAction) => match<string>(action.name)
      .with(`${APP_PREFIX}OnReplyBoxEmail`, () => {
        const subjectTicketId = action.subject;
        const email = action.payload.email;

        if (!ticketId || !email || !client || !context?.settings) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(emailKey(ticketId, "*"))
          .then((selections) => {
            const taskIds = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id as ITaskFromList["id"]);

            return Promise
              .all(taskIds.map((taskId) => createNote(client, taskId, email, context.settings)))
              .then(() => query.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}OnReplyBoxNote`, () => {
        const subjectTicketId = action.subject;
        const note = action.payload.note;

        if (!ticketId || !note || !client || !context?.settings) {
          return;
        }

        if (subjectTicketId !== ticketId) {
          return;
        }

        client.setBlocking(true);
        client.getState<{ id: string; selected: boolean }>(noteKey(ticketId, "*"))
          .then((selections) => {
            const taskIds = selections
              .filter(({ data }) => data?.selected)
              .map(({ data }) => data?.id as ITaskFromList["id"]);

            return Promise
              .all(taskIds.map((taskId) => createNote(client, taskId, note, context.settings)))
              .then(() => query.invalidateQueries());
          })
          .finally(() => client.setBlocking(false));
      })
      .with(`${APP_PREFIX}ReplyBoxEmailAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(emailKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {

                if (result.isSuccess) {
                  registerReplyBoxEmailsAdditionsTargetAction(client, ticketId, tasks.map(({ id }) => id), tasksMap);
                }
              });
          }
        })
      })
      .with(`${APP_PREFIX}ReplyBoxNoteAdditions`, () => {
        (action.payload ?? []).forEach((selection: { id: string; selected: boolean; }) => {
          const subjectTicketId = action.subject;

          if (ticketId) {
            client?.setState(noteKey(subjectTicketId, selection.id), { id: selection.id, selected: selection.selected })
              .then((result) => {
                if (result.isSuccess) {
                  registerReplyBoxNotesAdditionsTargetAction(client, subjectTicketId, tasks.map(({ id }) => id), tasksMap);
                }
              });
          }
        })
      })
      .run(),
    200
  );

  useDeskproAppEvents({
    onTargetAction: debounceTargetAction,
  }, [context?.data]);

  return (
    <ReplyBoxContext.Provider value={{
      setSelectionState,
      getSelectionState,
      deleteSelectionState,
    }}>
      {children}
    </ReplyBoxContext.Provider>
  );
};

export { useReplyBox, ReplyBoxProvider };
