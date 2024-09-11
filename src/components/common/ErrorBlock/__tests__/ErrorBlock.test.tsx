import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { ErrorBlock } from "../ErrorBlock";
import type { Props } from "../ErrorBlock";

const renderErrorBlock = (props?: Partial<Props>) => render((
  <ErrorBlock texts={props?.texts || ["Some error"]} />
), { wrappers: { theme: true } });

describe("AdminCallback", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { getByText } = renderErrorBlock();
    expect(getByText("Some error")).toBeInTheDocument();
  });

  test("should show two errors", async () => {
    const { getByText } = renderErrorBlock({ texts: ["one error", "two error"]});

    expect(getByText("one error")).toBeInTheDocument();
    expect(getByText("two error")).toBeInTheDocument();
  });
});
