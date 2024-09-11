import { IDeskproClient } from "@deskpro/app-sdk";
import { ENTITY } from "@/constants";
import type { DPTicket } from "@/types";
import type { ITask } from "@/services/wrike/types";

const deleteEntityService = (
  client: IDeskproClient,
  ticketId: DPTicket["id"],
  entityId: ITask["id"],
) => {
  return client.getEntityAssociation(ENTITY, ticketId)
    .delete(entityId);
};

export { deleteEntityService };
