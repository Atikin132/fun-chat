import { Message } from "../interfaces/message.interface.js";
import { hasNumberProp, hasStringProp } from "../utils/has-type-prop.js";

export function isMessage(obj: unknown): obj is Message {
  return (
    typeof obj === "object" &&
    obj !== null &&
    hasStringProp(obj, "id") &&
    hasStringProp(obj, "from") &&
    hasStringProp(obj, "to") &&
    hasStringProp(obj, "text") &&
    hasNumberProp(obj, "datetime") &&
    "status" in obj
  );
}
