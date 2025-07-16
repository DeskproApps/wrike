import { P5 } from "@deskpro/deskpro-ui";
import styled from "styled-components";
import { dpNormalize } from "./styles";
import { addBlankTargetToLinks } from "@/utils";
import type { FC } from "react";
import { DeskproAppTheme } from "@deskpro/app-sdk";

type Props = {
  text?: string,
};

const Container = styled.div<DeskproAppTheme>`
  width: 100%;

  ${dpNormalize};
`;

const DPNormalize: FC<Props> = ({ text }) => (
  <Container>
    <P5 dangerouslySetInnerHTML={{ __html: addBlankTargetToLinks(text) || "-" }} />
  </Container>
);

export { DPNormalize };
