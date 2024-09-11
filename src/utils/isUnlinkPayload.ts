import type { EventPayload, UnlinkPayload } from "../types";

const isUnlinkPayload = (
  payload: EventPayload,
): payload is UnlinkPayload => {
  return typeof payload === "object" && Boolean(payload) && "task" in payload;
};

export { isUnlinkPayload };
