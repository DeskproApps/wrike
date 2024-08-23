import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { NotFound } from "../NotFound";
import type { Props } from "../NotFound";

const renderNotFound = (props?: Partial<Props>) => render((
  <NotFound text={props?.text} />
), { wrappers: { theme: true } });

describe("NotFound", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = renderNotFound();
    expect(await findByText(/No found/i)).toBeInTheDocument();
  });

  test("should show \"Nothing found message\" if pass text", async () => {
    const { findByText } = renderNotFound({ text: "Nothing found message" });
    expect(await findByText(/Nothing found message/i)).toBeInTheDocument();
  });
});
