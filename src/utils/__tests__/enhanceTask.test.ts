import { enhanceTask } from "../enhanceTask";
import type { ITask, IWorkflow, ICustomField } from "@/services/wrike/types";

const mockTask = {
  id: "IEAGJJFWKRMLJ433",
  title: "first task",
  customFields: [
    {
      "id": "IEAGJJFWJUAGXMGF",
      "value": "Low"
    },
  ],
};

const mockCustomFields = [{
  "id": "IEAGJJFWJUAGXMGF",
  "accountId": "IEAGJJFW",
  "title": "Impact",
  "type": "DropDown",
  "spaceId": "IEAGJJFWI5MLJ426",
  "sharedIds": [],
  "sharing": {},
  "settings": {
    "inheritanceType": "All",
    "applicableEntityTypes": [
      "WorkItem"
    ],
    "values": [
      "Low",
      "Medium",
      "High"
    ],
    "options": [
      {
        "value": "Low",
        "color": "Green"
      },
      {
        "value": "Medium",
        "color": "Yellow"
      },
      {
        "value": "High",
        "color": "Red"
      }
    ],
    "optionColorsEnabled": true,
    "allowOtherValues": false,
    "readOnly": false
  }
}];

describe("utils", () => {
  describe("enhanceTask", () => {
    test("should return enhanced note", () => {
      expect(
        enhanceTask(mockTask as ITask, {} as IWorkflow, mockCustomFields as ICustomField[])
      ).toStrictEqual({
        ...mockTask,
        status: undefined,
        customFields: [{
          meta: mockCustomFields[0],
          value: mockTask.customFields[0],
        }],
      });
    });
  });
});
