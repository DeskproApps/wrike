import { IDeskproClient } from "@deskpro/app-sdk";
import { ENTITY } from "@/constants";
import type { DPTicket } from "@/types";

const getEntityListService = (
  client: IDeskproClient,
  ticketId: DPTicket["id"],
): Promise<string[]> => {
  return client
    .getEntityAssociation(ENTITY, ticketId)
    .list();
};

export { getEntityListService };
