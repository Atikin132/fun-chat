import { MessageStatus } from "../interfaces/message-status.interface.js";
import { hasBooleanProp } from "../utils/has-type-prop.js";

export function isMessageStatus(obj: unknown): obj is MessageStatus {
  return (
    typeof obj === "object" &&
    obj !== null &&
    hasBooleanProp(obj, "isDelivered") &&
    hasBooleanProp(obj, "isReaded") &&
    hasBooleanProp(obj, "isEdited")
  );
}
