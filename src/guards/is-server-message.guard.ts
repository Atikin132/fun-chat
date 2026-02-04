import { ServerMessage } from "../interfaces/server-message.interface.js";
import { hasStringProp } from "../utils/has-type-prop.js";

export function isServerMessage(obj: unknown): obj is ServerMessage {
  return (
    typeof obj === "object" &&
    obj !== null &&
    hasStringProp(obj, "id") &&
    hasStringProp(obj, "type") &&
    "payload" in obj
  );
}
