import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import userEvent from "@testing-library/user-event";
import { mockTasks } from "@/testing";
import { Tasks } from "../Tasks";
import type { ITaskFromList } from "@/services/wrike/types";
import type { Props } from "../Tasks";

const renderTasks = (props?: Partial<Props>) => render((
  <Tasks
    isLoading={Boolean(props?.isLoading)}
    onChangeSelectedTask={props?.onChangeSelectedTask ?? jest.fn()}
    tasks={props?.tasks ?? mockTasks["data"] as ITaskFromList[]}
    selectedTasks={props?.selectedTasks ?? []}
  />
), { wrappers: { theme: true } });

describe("LinkTasks", () => {
  describe("Tasks", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", () => {
      const { getByText } = renderTasks();

      expect(getByText("first task")).toBeInTheDocument();
      expect(getByText("second task")).toBeInTheDocument();
      expect(getByText("third task")).toBeInTheDocument();
      expect(getByText("four task")).toBeInTheDocument();
    });

    test("should show \"No found\" if no tasks passed", () => {
      const { getByText } = renderTasks({ tasks: [] });
      expect(getByText("No tasks found")).toBeInTheDocument();
    });

    test("should navigate to the details task", async () => {
      const mockOnChangeSelected = jest.fn();
      const { getByRole } = renderTasks({ onChangeSelectedTask: mockOnChangeSelected });
      const button = getByRole("button", { name: /first task/i });

      await userEvent.click(button as Element);

      expect(mockOnChangeSelected).toHaveBeenCalledWith(mockTasks["data"][3])
    });
  });
});
