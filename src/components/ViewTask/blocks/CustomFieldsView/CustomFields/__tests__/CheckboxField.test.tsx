import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { CheckboxField } from "../CheckboxField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Checkbox);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderCheckboxField = (props?: Partial<CustomFieldType>) => render((
  <CheckboxField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("CheckboxField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByRole } = renderCheckboxField();
        const checkbox = getByRole("checkbox");

        expect(checkbox).toBeChecked();
      });

      test("shouldn't be checked", () => {
        const { getByRole } = renderCheckboxField({
          value: { value: "false" } as CustomFieldType["value"]
        });
        const checkbox = getByRole("checkbox");

        expect(checkbox).not.toBeChecked();
      });
    });
  });
});
