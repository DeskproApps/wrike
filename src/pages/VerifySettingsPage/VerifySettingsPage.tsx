import { useState, useCallback } from "react";
import { useDeskproAppEvents, useDeskproAppClient } from "@deskpro/app-sdk";
import { getAccounts } from "@/services/wrike";
import { VerifySettings } from "@/components/VerifySettings";
import type { FC } from "react";
import type { Settings } from "@/types";
import type { IAccount } from "@/services/wrike/types";

const getError = (err: Error): string => {
  const defaultError = "Failed to connect to Wrike, settings seem to be invalid";

  try {
    const parsedError = JSON.parse(err.message);
    const parsedMessage = JSON.parse(parsedError.message);
    return parsedMessage.errorDescription || defaultError;
  } catch (e) {
    //..
  }

  return defaultError;
};

const VerifySettingsPage: FC = () => {
  const { client } = useDeskproAppClient();
  const [accounts, setAccounts] = useState<Array<IAccount["name"]>>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);

  const onVerifySettings = useCallback(() => {
    if (!client || !settings?.access_token) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setAccounts([]);

    return getAccounts(client, settings)
      .then((res) => {
        const accounts = (Array.isArray(res.data) ? res.data : []).map((account) => account.name);
        setAccounts(accounts);
      })
      .catch((err) => setError(getError(err)))
      .finally(() => setIsLoading(false));
  }, [client, settings]);

  useDeskproAppEvents({
    onAdminSettingsChange: setSettings,
  }, [client]);

  return (
    <VerifySettings
      error={error}
      settings={settings}
      accounts={accounts}
      isLoading={isLoading}
      onVerifySettings={onVerifySettings}
    />
  );
};

export { VerifySettingsPage };
