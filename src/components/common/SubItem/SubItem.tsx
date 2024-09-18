import { useState, useCallback } from "react";
import { P5, Spinner, Checkbox } from "@deskpro/deskpro-ui";
import { Card } from "../Card";
import type { FC } from "react";
import type { ITaskFromList } from "@/services/wrike/types";

export type Props = {
  item: ITaskFromList;
  onComplete?: (
    itemId: ITaskFromList["id"],
    complete: boolean,
  ) => Promise<unknown>;
};

const SubItem: FC<Props> = ({ item, onComplete }) => {
  const boxSize = 14;
  const [isLoading, setIsLoading] = useState(false);
  const isComplete = item.status === "Completed";

  const onChange = useCallback(() => {
    if (onComplete && item.id) {
      setIsLoading(true);
      onComplete(item.id, !isComplete).finally(() => setIsLoading(false));
    }
  }, [onComplete, item, isComplete]);

  return (
    <Card style={{ marginBottom: 7 }}>
      <Card.Media>
        {isLoading
          ? (
            <div style={{ width: `${boxSize}px`, height: `${boxSize}px` }}>
              <Spinner size="extra-small"/>
            </div>
          )
          : (
            <Checkbox
              size={boxSize}
              onChange={onChange}
              checked={isComplete}
              disabled={!onComplete}
            />
          )
        }
      </Card.Media>
      <Card.Body size={boxSize}>
        <P5>{item.title}</P5>
      </Card.Body>
    </Card>
  );
};

export { SubItem };
