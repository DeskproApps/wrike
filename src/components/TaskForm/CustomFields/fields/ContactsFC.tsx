import { useMemo } from "react";
import {
  Select,
  Member,
  useQueryWithClient,
  useDeskproLatestAppContext,
} from "@deskpro/app-sdk";
import { getUsersByIds, getUsers } from "@/services/wrike";
import { QueryKey } from "@/utils/query";
import { getFullName, getOption } from "@/utils";
import type { FC } from "react";
import type { IUser } from "@/services/wrike/types";
import type { CustomFieldProps } from "../../types";

const ContactsFC: FC<CustomFieldProps> = ({ field, formControl }) => {
  const { context } = useDeskproLatestAppContext();
  const contactIds = Array.isArray(field.settings.contacts) ? field.settings.contacts : [];

  const users = useQueryWithClient(
    [QueryKey.CONTACTS, ...contactIds],
    (client) => ((contactIds?.length > 0)
      ? getUsersByIds(client, contactIds, context?.settings)
      : getUsers(client, context?.settings)
    ),
    { enabled: Boolean(context?.settings) },
  );

  const options = useMemo(() => {
    return (users.data?.data ?? []).map((user) => {
      const label = (
        <Member key={user.id} name={getFullName(user)} avatarUrl={user.avatarUrl}/>
      );
      return getOption(user.id, label, getFullName(user));
    });
  }, [users.data?.data]);

  return (
    <Select<IUser["id"]>
      id={field.id}
      showInternalSearch
      options={options}
      closeOnSelect={false}
      initValue={formControl.field.value}
      onChange={formControl.field.onChange}
    />
  );
};

export { ContactsFC };
