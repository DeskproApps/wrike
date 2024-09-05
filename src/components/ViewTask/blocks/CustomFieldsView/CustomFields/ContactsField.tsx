import { useMemo } from "react";
import { Members, useQueryWithClient, useDeskproLatestAppContext } from "@deskpro/app-sdk";
import { getUsersByIds } from "@/services/wrike";
import { getFullName } from "@/utils";
import { QueryKey } from "@/utils/query";
import { NoValue } from "./NoValue";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const ContactsField: FC<Props> = ({ value }) => {
  const { context } = useDeskproLatestAppContext();
  const ids = `${value.value}`.split(",").filter(Boolean);

  const { data } = useQueryWithClient(
    [QueryKey.CONTACTS, ...ids],
    (client) => getUsersByIds(client, ids, context?.settings),
    { enabled: ids?.length > 0 && Boolean(context?.settings) },
  );

  const contacts = useMemo(() => {
    return (data?.data ?? []).map((contact) => ({
      name: getFullName(contact),
      avatarUrl: contact.avatarUrl,
    }));
  }, [data?.data]);

  return (contacts.length > 0)
    ? <Members members={contacts}/>
    : <NoValue/>
};

export { ContactsField };
