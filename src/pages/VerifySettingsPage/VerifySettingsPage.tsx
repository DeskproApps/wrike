import { useState, useCallback } from "react";
import { useDeskproAppEvents, useDeskproAppClient } from "@deskpro/app-sdk";
import { getAccounts } from "../../api/api";
import { VerifySettings } from "../../components/VerifySettings";
import type { FC } from "react";
import type { Maybe, Settings } from "../../types";
import type { IAccount } from "../../api/types";

const getError = (err: Maybe<Error>): string => {
  const defaultError = "Failed to connect to Wrike, settings seem to be invalid";
  let error;

  if (!err) {
    error = defaultError;
  } else {
    try {

      const parsedError = JSON.parse(err.message);
      const parsedMessage = JSON.parse(parsedError.message);
      error = parsedMessage.errorDescription || defaultError;
    } catch (e) {
      error = defaultError;
    }
  }

  return error;
};

const VerifySettingsPage: FC = () => {
  const { client } = useDeskproAppClient();
  const [accounts, setAccounts] = useState<Array<IAccount["name"]>>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Maybe<string>>(null);

  const onVerifySettings = useCallback(() => {
    if (!client || !settings?.access_token) {
      return;
    }

    setIsLoading(true);
    setError("");
    setAccounts([]);

    return getAccounts(client, settings)
      .then((res) => {
        const accounts = (Array.isArray(res.data) && res.data?.length > 0)
          ? res.data.map((account) => account.name)
          : [];
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
