import { useState } from "react";
import { P5 } from "@deskpro/deskpro-ui";
import { useInitialisedDeskproAppClient } from "@deskpro/app-sdk";
import { getEntityAssociationCountService } from "@/services/deskpro";

type Props<T> = { entityId?: T };

const DeskproTickets = <T,>({ entityId }: Props<T>) => {
  const [ticketCount, setTicketCount] = useState<number>(0);

  useInitialisedDeskproAppClient((client) => {
    if (entityId) {
      getEntityAssociationCountService(client, `${entityId}`)
        .then(setTicketCount)
        .catch(() => {});
    }
  }, [entityId]);

  return (
    <P5>{ticketCount}</P5>
  );
};

export { DeskproTickets };
