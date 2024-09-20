import { Stack } from "@deskpro/deskpro-ui";
import { Title } from "@deskpro/app-sdk";
import { SubItem, NotFound } from "@/components/common";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

export type Props = {
  subItems: ITaskFromList[];
};

const SubItems: FC<Props> = ({ subItems }) => {
  return (
    <>
      <Title title={`Subitems (${subItems.length})`}/>

      <Stack vertical gap={10}>
        {!subItems.length
          ? <NotFound text="No Subitems found"/>
          : subItems.map((item: ITaskFromList) => (
            <SubItem key={item.id} item={item} />
          ))
        }
      </Stack>
    </>
  );
};

export { SubItems };
