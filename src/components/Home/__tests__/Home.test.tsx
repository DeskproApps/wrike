import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import userEvent from "@testing-library/user-event";
import { mockTasks } from "@/testing";
import { Home } from "../Home";
import type { ITaskFromList } from "@/services/wrike/types";
import type { Props } from "../Home";

const renderHome = (props?: Partial<Props>) => render((
  <Home
    tasks={props?.tasks ?? mockTasks["data"] as ITaskFromList[]}
    onNavigateToTask={props?.onNavigateToTask ?? jest.fn()}
  />
), { wrappers: { theme: true } });

describe("Home", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", () => {
    const { getByText } = renderHome();

    expect(getByText("first task")).toBeInTheDocument();
    expect(getByText("second task")).toBeInTheDocument();
    expect(getByText("third task")).toBeInTheDocument();
    expect(getByText("four task")).toBeInTheDocument();
  });

  test("should show \"No found\" if no tasks passed", () => {
    const { getByText } = renderHome({ tasks: [] });
    expect(getByText("No tasks found")).toBeInTheDocument();
  });

  test("should navigate to the details task", async () => {
    const mockOnNavigate = jest.fn();
    const { getByRole } = renderHome({ onNavigateToTask: mockOnNavigate });
    const button = getByRole("button", { name: /first task/i });

    await userEvent.click(button as Element);

    expect(mockOnNavigate).toHaveBeenCalled()
  });
});
