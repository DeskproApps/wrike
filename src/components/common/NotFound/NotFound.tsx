import { P1 } from "@deskpro/deskpro-ui";
import type { FC, ReactNode } from "react";

export type Props = {
  text?: ReactNode;
};

const NotFound: FC<Props> = ({ text = "No found" } = {}) => (
  <P1>{text}</P1>
);

export { NotFound };
