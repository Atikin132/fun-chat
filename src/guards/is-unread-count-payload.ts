import { hasNumberProp } from "../utils/has-type-prop.js";

export function isUnreadCountPayload(obj: unknown): obj is { count: number } {
  return typeof obj === "object" && obj !== null && hasNumberProp(obj, "count");
}
