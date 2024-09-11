import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { NoValue } from "../NoValue";
import type { Props } from "../NoValue";

const renderNoValue = (props?: Partial<Props>) => render((
  <NoValue text={props?.text} />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("NoValue", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderNoValue();
        expect(getByText("-")).toBeInTheDocument();
      });

      test("shouldn't show custom text", () => {
        const { getByText } = renderNoValue({ text: "noooooo!" });
        expect(getByText("noooooo!")).toBeInTheDocument();
      });
    });
  });
});
