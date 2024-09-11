import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { DateField } from "../DateField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Date);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderDateField = (props?: Partial<CustomFieldType>) => render((
  <DateField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("DateField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderDateField();
        expect(getByText("11 Sept 2024")).toBeInTheDocument();
      });

      test("shouldn't show if the wrong date", () => {
        const { getByText } = renderDateField({
          value: { value: "KUATMOGX" } as CustomFieldType["value"],
        });
        expect(getByText("-")).toBeInTheDocument();
      });
    });
  });
});
