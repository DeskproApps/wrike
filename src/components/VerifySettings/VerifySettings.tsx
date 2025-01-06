import { Stack } from "@deskpro/deskpro-ui";
import { Button, Invalid, Secondary } from "@/components/common";
import type { FC } from "react";
import type { Settings } from "@/types";
import type { IAccount } from "@/services/wrike/types";

export type Props = {
  isLoading: boolean;
  settings: Settings;
  error: string|null;
  accounts: Array<IAccount["name"]>;
  onVerifySettings: () => void;
};

const VerifySettings: FC<Props> = ({
  error,
  accounts,
  settings,
  isLoading,
  onVerifySettings,
}) => {
  return (
    <Stack gap={8} align="baseline">
      <pre>
        {JSON.stringify(settings, null, 2)}
      </pre>
      <Button
        text="Verify Settings"
        intent="secondary"
        onClick={onVerifySettings}
        loading={isLoading}
        disabled={!settings?.access_token || isLoading}
      />
      {(accounts.length > 0)
        ? <Secondary>Verified as &lt;{accounts.join(", ")}&gt;</Secondary>
        : error
        ? <Invalid type="p1">{error}</Invalid>
        : ""
      }
    </Stack>
  );
};

export { VerifySettings };
