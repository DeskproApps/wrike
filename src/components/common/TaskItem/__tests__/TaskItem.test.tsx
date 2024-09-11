import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import userEvent from "@testing-library/user-event";
import { TaskItem } from "../TaskItem";
import { mockTask } from "@/testing";
import type { ITaskFromList } from "@/services/wrike/types";
import type { Props } from "../TaskItem";

const renderTaskItem = (props?: Partial<Props>) => render((
  <TaskItem
    task={props?.task ?? mockTask["data"][0] as unknown as ITaskFromList}
    onClickTitle={props?.onClickTitle}
  />
), { wrappers: { theme: true } });

describe("TaskItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", () => {
    const { getByText } = renderTaskItem();

    expect(getByText("first task")).toBeInTheDocument();
    expect(getByText("Active")).toBeInTheDocument();
    expect(getByText("High")).toBeInTheDocument();
    expect(getByText("06 Sept 2024")).toBeInTheDocument();
  });

  test("should trigger click on the title", async () => {
    const mockOnClick = jest.fn();
    const { getByRole } = renderTaskItem({ onClickTitle: mockOnClick });
    const button = getByRole("button", { name: /first task/i });

    await userEvent.click(button as Element);

    expect(mockOnClick).toHaveBeenCalled()
  });
});
