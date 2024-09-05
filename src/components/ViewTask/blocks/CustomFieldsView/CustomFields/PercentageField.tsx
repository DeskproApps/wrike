import { P5 } from "@deskpro/deskpro-ui";
import { formatPrice } from "@/utils";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType;

const PercentageField: FC<Props> = ({ value, meta }) => {
  return (
    <P5>{formatPrice(value.value, { style: "decimal", fraction: meta.settings.decimalPlaces })}%</P5>
  );
};

export { PercentageField };
