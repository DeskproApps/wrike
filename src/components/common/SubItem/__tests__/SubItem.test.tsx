import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { SubItem } from "../SubItem";
import type { Props } from "../SubItem";
import { mockSubItems } from "@/testing";

const mockCompletedItem = mockSubItems.data[2];
const mockUnCompletedItem = mockSubItems.data[0];

const renderSubItem = (props?: Partial<Props>) => render((
  <SubItem
    item={props?.item || mockCompletedItem as never}
    onComplete={props?.onComplete ?? jest.fn()}
  />
), { wrappers: { theme: true } });

describe("SubItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
    cleanup();
  });

  test("render", async () => {
    const { findByText } = renderSubItem();
    expect(await findByText(/Subitem one/i)).toBeInTheDocument();
  });

  test("render completed item", async () => {
    const { container } = renderSubItem({ item: mockCompletedItem as never });
    const checkbox = container.querySelector("input[type=checkbox]") as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("render uncompleted item", async () => {
    const { container } = renderSubItem({ item: mockUnCompletedItem as never });
    const checkbox = container.querySelector("input[type=checkbox]") as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });
});
