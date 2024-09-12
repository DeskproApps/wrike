import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { DurationField } from "../DurationField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Duration);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderDurationField = (props?: Partial<CustomFieldType>) => render((
  <DurationField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("DurationField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderDurationField();
        expect(getByText("2h 25m")).toBeInTheDocument();
      });
    });
  });
});
