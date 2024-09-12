import type { IUser } from "@/services/wrike/types";

const getFullName = (contact: IUser|undefined): string => {
  const name = [
    contact?.firstName,
    contact?.lastName,
  ].filter(Boolean);

  return name.length ? name.join(" ") : contact?.primaryEmail || contact?.profiles[0]?.email || "";
};

export { getFullName };
