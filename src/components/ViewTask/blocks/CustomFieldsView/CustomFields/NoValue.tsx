import { P5 } from "@deskpro/deskpro-ui";
import type { FC } from "react";

type Props = { text?: string|undefined };

const NoValue: FC<Props> = ({ text }) => (
  <P5>{!text ? "-" : text}</P5>
);

export { NoValue };
