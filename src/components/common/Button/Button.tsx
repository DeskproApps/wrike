import { FC } from "react";
import styled from "styled-components";
import { Button as ButtonUI } from "@deskpro/deskpro-ui";
import type { ButtonProps } from "@deskpro/deskpro-ui";

export const Button: FC<ButtonProps> = styled(ButtonUI)`
  min-width: 72px;
  justify-content: center;
`;
