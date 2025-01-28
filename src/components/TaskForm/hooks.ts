import { useMemo, createElement } from "react";
import {
  Member,
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getUsers, getCustomFields, getFolders } from "@/services/wrike";
import { IMPORTANCES } from "@/constants";
import { QueryKey } from "@/utils/query";
import { getOption, getFullName } from "@/utils";
import type { Option, Settings } from "@/types";
import type { IUser, ICustomField, IFolderFromList } from "@/services/wrike/types";

type UseFormDeps = () => {
  isLoading: boolean;
  folderOptions: Array<Option<IFolderFromList["id"]>>;
  importanceOptions: Array<Option<string>>;
  assigneeOptions: Array<Option<IUser["id"]>>;
  customFields: ICustomField[];
};

const useFormDeps: UseFormDeps = () => {
  const { context } = useDeskproLatestAppContext<unknown, Settings>();

  const folders = useQueryWithClient(
    [QueryKey.FOLDERS],
    (client) => getFolders(client, context?.settings),
    { enabled: Boolean(context?.settings) }
  );

  const folderOptions = useMemo(() => {
    return (folders.data?.data ?? []).map(({ id, title }) => getOption(id, title));
  }, [folders.data?.data]);

  const importanceOptions = useMemo(() => {
    return IMPORTANCES.map((i) => getOption(i, i));
  }, []);

  const users = useQueryWithClient(
    [QueryKey.CONTACTS],
    (client) => getUsers(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  const assigneeOptions = useMemo(() => {
    return (users.data?.data ?? []).map((user) => {
      const label = createElement(Member, {
        key: user.id,
        name: getFullName(user),
        avatarUrl: user.avatarUrl,
      });
      return getOption(user.id, label, getFullName(user));
    });
  }, [users.data?.data]);

  const customFields = useQueryWithClient(
    [QueryKey.CUSTOM_FIELDS],
    (client) => getCustomFields(client, context?.settings),
    { enabled: Boolean(context?.settings) },
  );

  return {
    isLoading: [users, folders, customFields].some(({ isLoading }) => isLoading),
    folderOptions,
    importanceOptions,
    assigneeOptions,
    customFields: customFields.data?.data ?? [],
  };
};

export { useFormDeps };
