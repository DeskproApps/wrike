import { cleanup } from "@testing-library/react";
import { render } from "@deskpro/app-testing-utils";
import { mockTask, mockCustomFields } from "@/testing";
import { CustomFieldsMap } from "@/constants";
import { TextField } from "../TextField";
import type { CustomFieldType } from "@/types";

const meta = mockCustomFields.data.find(({ type }) => type === CustomFieldsMap.Text);
const value = mockTask.data[0].customFields.find(({ id }) => id === meta?.id);

const renderTextField = (props?: Partial<CustomFieldType>) => render((
  <TextField
    meta={props?.meta ?? meta as CustomFieldType["meta"]}
    value={props?.value ?? value as CustomFieldType["value"]}
  />
), { wrappers: { theme: true } });

describe("ViewTask", () => {
  describe("CustomFields", () => {
    describe("TextField", () => {
      afterEach(() => {
        jest.clearAllMocks();
        cleanup();
      });

      test("render", () => {
        const { getByText } = renderTextField();
        expect(getByText("Text field Text field Text field Text field Text field")).toBeInTheDocument();
      });
    });
  });
});
