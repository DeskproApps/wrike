import { Stack } from "@deskpro/deskpro-ui";
import { Button } from "@/components/common";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

export type Props = {
  isSubmitting: boolean,
  onCancel: () => void,
  selectedTasks: ITaskFromList[],
  onLinkTasks: () => void,
};

const Buttons: FC<Props> = ({
  onCancel,
  onLinkTasks,
  isSubmitting,
  selectedTasks,
}) => {
  return (
    <Stack justify="space-between">
      <Button
        type="button"
        text="Link Tasks"
        disabled={!selectedTasks.length || isSubmitting}
        loading={isSubmitting}
        onClick={onLinkTasks}
      />
      <Button
        type="button"
        text="Cancel"
        intent="secondary"
        onClick={onCancel}
      />
    </Stack>
  )
};

export { Buttons };
