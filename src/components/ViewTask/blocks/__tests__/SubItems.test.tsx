import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockSubItems } from "@/testing";
import { SubItems } from "../SubItems";
import type { ITaskFromList } from "@/services/wrike/types";
import type { Props } from "../SubItems";

const renderDetails = (props?: Partial<Props>) => render((
  <SubItems subItems={props?.subItems ?? mockSubItems.data as ITaskFromList[]}/>
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("SubItems", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", () => {
      const { getByText } = renderDetails();

      expect(getByText("Third subitem")).toBeInTheDocument();
      expect(getByText("Another subitem")).toBeInTheDocument();
      expect(getByText("Subitem one")).toBeInTheDocument();
    });

    test("should show \"No Subitems found\" if no subitems", () => {
      const { getByText } = renderDetails({ subItems: [] });

      expect(getByText("No Subitems found")).toBeInTheDocument();
    });
  });
});
