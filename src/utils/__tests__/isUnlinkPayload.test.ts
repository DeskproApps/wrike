import { isUnlinkPayload } from "../isUnlinkPayload";
import { mockTask } from "@/testing";
import type { UnlinkPayload, TaskType } from "@/types";

const payload: UnlinkPayload = {
  type: "unlink",
  task: mockTask.data[0] as unknown as TaskType,
};

describe("isUnlinkPayload", () => {
  test.each([undefined, null, "", 0, true, false, {}])("wrong value: %p", (payload) => {
    expect(isUnlinkPayload(payload as UnlinkPayload)).toBeFalsy();
  });

  test("shouldn't be unlink payload", () => {
    expect(isUnlinkPayload({ type: "unlink" } as UnlinkPayload)).toBeFalsy();
  });

  test("should unlink payload", () => {
    expect(isUnlinkPayload(payload)).toBeTruthy();
  });
});
