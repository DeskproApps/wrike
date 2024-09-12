import styled from "styled-components";
import { Icon } from "@deskpro/deskpro-ui";
import { Input } from "@/components/common";
import type { FC } from "react";
import type { CustomFieldProps } from "../../types";

const StyledInput = styled(Input)`
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  & {
    -moz-appearance: textfield;
  }
`;

const PercentageCF: FC<CustomFieldProps> = ({ formControl }) => (
  <StyledInput
    type="number"
    rightIcon={<Icon icon="outline-dazzle-percent" themeColor="grey40"/>}
    style={{ paddingRight: 0 }}
    {...formControl.field}
  />
);

export { PercentageCF };
