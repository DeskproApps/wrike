import { HorizontalDivider as HorizontalDividerSDK } from "@deskpro/app-sdk";
type Props = {
  full?: boolean;
  style?: React.CSSProperties;
};
export const HorizontalDivider = ({ style }: Props) => {
  return (
    <HorizontalDividerSDK
      style={{ width: "100%", ...style }}
    />
  );
};
