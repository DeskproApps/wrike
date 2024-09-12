import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { DropDownField } from "../DropDownField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.DropDown);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderDropDownField = (props?: Partial<CustomFieldType>) => render((
  <DropDownField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("DropDownField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderDropDownField();
        expect(getByText("Low")).toBeInTheDocument();
      });
    });
  });
});
