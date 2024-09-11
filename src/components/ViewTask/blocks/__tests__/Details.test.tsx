import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockWorkflows } from "@/testing";
import { enhanceTask } from "@/utils";
import { Details } from "../Details";
import type { Props } from "../Details";

const mockEnhanceTask = enhanceTask(mockTask["data"][0], mockWorkflows["data"][0], []);

const renderDetails = (props?: Partial<Props>) => render((
  <Details task={props?.task ?? mockEnhanceTask}/>
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("Details", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", () => {
      const { getByText } = renderDetails();

      expect(getByText("first task")).toBeInTheDocument();
      expect(getByText("Add a description for the task here")).toBeInTheDocument();
      expect(getByText("High")).toBeInTheDocument();
      expect(getByText("WsTask")).toBeInTheDocument();
      expect(getByText("05 Sept 2024, 09:00")).toBeInTheDocument();
      expect(getByText("06 Sept 2024, 17:00")).toBeInTheDocument();
    });
  });
});
