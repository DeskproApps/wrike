import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@deskpro/app-testing-utils";
import { mockTasks } from "@/testing";
import { Buttons } from "../Buttons";
import type { ITaskFromList } from "@/services/wrike/types";
import type { Props } from "../Buttons";

const renderButtons = (props?: Partial<Props>) => render((
  <Buttons
    onCancel={props?.onCancel ?? jest.fn()}
    isSubmitting={Boolean(props?.isSubmitting)}
    onLinkTasks={props?.onLinkTasks ?? jest.fn()}
    selectedTasks={props?.selectedTasks ?? mockTasks["data"] as ITaskFromList[]}
  />
), { wrappers: { theme: true } });

describe("LinkTasks", () => {
  describe("Buttons", () => {
    afterEach(() => {
      jest.clearAllMocks();
      cleanup();
    });

    test("render", async () => {
      const { getByRole } = renderButtons();
      const linkButton = getByRole("button", { name: "Link Tasks" });
      const cancelButton = getByRole("button", { name: "Cancel" });

      expect(linkButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });

    test("shouldn't click \"Link Tasks\" if no linked tasks", async () => {
      const mockOnLink = jest.fn();
      const { getByRole } = renderButtons({ onLinkTasks: mockOnLink, selectedTasks: [] });
      const linkButton = getByRole("button", { name: "Link Tasks" });

      await userEvent.click(linkButton as Element);

      expect(mockOnLink).not.toHaveBeenCalled();
    });

    test("should click \"Link Tasks\"", async () => {
      const mockOnLink = jest.fn();
      const { getByRole } = renderButtons({ onLinkTasks: mockOnLink });
      const linkButton = getByRole("button", { name: "Link Tasks" });

      await userEvent.click(linkButton as Element);

      expect(mockOnLink).toHaveBeenCalled();
    });

    test("shouldn't click if it's submitting", async () => {
      const mockOnLink = jest.fn();
      const { getByRole } = renderButtons({ isSubmitting: true, onLinkTasks: mockOnLink });
      const linkButton = getByRole("button", { name: "Link Tasks" });

      await userEvent.click(linkButton as Element);

      expect(mockOnLink).not.toHaveBeenCalled();
    });

    test("should click \"Cancel\"", async () => {
      const mockOnCancel = jest.fn();
      const { findByRole } = renderButtons({ onCancel: mockOnCancel });
      const cancelButton = await findByRole("button", { name: "Cancel" });

      await userEvent.click(cancelButton as Element);

      expect(mockOnCancel).toHaveBeenCalled();
    });
  });
});
