import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { PercentageField } from "../PercentageField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Percentage);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderPercentageField = (props?: Partial<CustomFieldType>) => render((
  <PercentageField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("PercentageField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderPercentageField();
        expect(getByText("79.00%")).toBeInTheDocument();
      });
    });
  });
});
