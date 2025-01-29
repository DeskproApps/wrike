import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@deskpro/app-testing-utils";
import { mockAccounts } from "@/testing";
import { VerifySettings } from "../VerifySettings";
import type { Props } from "../VerifySettings";
import { Settings } from "@/types";

const mockSettings: Settings = {
  instance_url: "",
  access_token: "thisIsAccessToken",
  default_comment_on_ticket_note: true,
  default_comment_on_ticket_reply: true
};

const mockAccountNames = mockAccounts["data"].map(({ name }) => name);

const renderVerifySettings = (props?: Partial<Props>) => render((
  <VerifySettings
    isLoading={Boolean(props?.isLoading)}
    settings={props?.settings ?? mockSettings}
    error={props?.error ?? null}
    accounts={props?.accounts ?? []}
    onVerifySettings={props?.onVerifySettings ?? jest.fn()}
  />
), { wrappers: { theme: true } });

describe("VerifySettings", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByRole } = renderVerifySettings();
    expect(await findByRole("button", { name: /Verify Settings/i })).toBeInTheDocument();
  });

  test("should show the verified message", async () => {
    const { findByText } = renderVerifySettings({ accounts: mockAccountNames });

    expect(await findByText(/Verified as <Zaporizhian Host>/i)).toBeInTheDocument();
  });

  test("should show the failed message", async () => {
    const { findByText } = renderVerifySettings({ error: "auth error" });
    expect(await findByText(/auth error/i)).toBeInTheDocument();
  });

  test("should trigger onVerifySettings", async () => {
    const onVerifySettings = jest.fn();
    const { getByRole } = renderVerifySettings({ onVerifySettings });
    const verifyButton = getByRole("button", { name: /Verify Settings/i });

    await userEvent.click(verifyButton as Element);

    expect(onVerifySettings).toHaveBeenCalledTimes(1);
  });
});
