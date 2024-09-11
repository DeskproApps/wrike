import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { MultipleField } from "../MultipleField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Multiple);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderMultipleField = (props?: Partial<CustomFieldType>) => render((
  <MultipleField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("MultipleField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderMultipleField();

        expect(getByText("one")).toBeInTheDocument();
        expect(getByText("three")).toBeInTheDocument();
        expect(getByText("five")).toBeInTheDocument();
      });
    });
  });
});
