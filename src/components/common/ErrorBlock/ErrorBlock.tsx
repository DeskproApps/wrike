import styled from "styled-components";
import { P5 } from "@deskpro/deskpro-ui";
import { DEFAULT_ERROR } from "@/constants";
import type { FC, ReactNode } from "react";

export type Props = {
  texts: ReactNode[];
};

const StyledErrorBlock = styled(P5)`
  margin-bottom: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.white};
  background-color: ${({ theme }) => theme.colors.red100};
`;

const ErrorBlock: FC<Props> = ({ texts }) => (
  <>
    {texts.map((msg, idx) => (
      <StyledErrorBlock key={idx}>{msg || DEFAULT_ERROR}</StyledErrorBlock>)
    )}
  </>
);

export { ErrorBlock };