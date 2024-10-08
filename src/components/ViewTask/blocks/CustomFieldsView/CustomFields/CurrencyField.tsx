import { P5 } from "@deskpro/deskpro-ui";
import { formatPrice } from "@/utils";
import { NoValue } from "./NoValue";
import type { FC } from "react";
import type { CustomFieldType } from "@/types";

type Props = CustomFieldType

const CurrencyField: FC<Props> = ({ value, meta }) => {
  if (!value.value) {
    return (
      <NoValue/>
    );
  }

  return (
    <P5>{formatPrice(value.value, { currency: meta.settings.currency })}</P5>
  );
};

export { CurrencyField };
