import type { EventPayload, NavigateToChangePage } from "@/types";

const isNavigatePayload = (
  payload?: EventPayload,
): payload is NavigateToChangePage => {
  return typeof payload === "object" && Boolean(payload) && "path" in payload;
};

export { isNavigatePayload };
