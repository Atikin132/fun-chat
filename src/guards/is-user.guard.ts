import { User } from "../interfaces/user.interface.js";
import { hasBooleanProp, hasStringProp } from "../utils/has-type-prop.js";

export function isUser(obj: unknown): obj is User {
  return (
    typeof obj === "object" &&
    obj !== null &&
    hasStringProp(obj, "login") &&
    hasStringProp(obj, "password") &&
    hasBooleanProp(obj, "isLogined")
  );
}
