import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { CurrencyField } from "../CurrencyField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Currency);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderCurrencyField = (props?: Partial<CustomFieldType>) => render((
  <CurrencyField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true, query: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("CurrencyField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderCurrencyField();
        expect(getByText("$5,000.00")).toBeInTheDocument();
      });

      test("shouldn't show if the wrong price number", () => {
        const { getByText } = renderCurrencyField({
          value: { value: "KUATMOGX" } as CustomFieldType["value"],
        });

        expect(getByText("-")).toBeInTheDocument();
      });
    });
  });
});
