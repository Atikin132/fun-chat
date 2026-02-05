import {
  UserAuthPayload,
  UsersPayload,
} from "../interfaces/user-payloads.interface.js";
import { isUserWithLogined } from "./is-user.guard.js";

export function isUserAuthPayload(obj: unknown): obj is UserAuthPayload {
  return typeof obj === "object" && obj !== null && "user" in obj;
}

export function isUsersPayload(obj: unknown): obj is UsersPayload {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "users" in obj &&
    Array.isArray((obj as Record<string, unknown>).users) &&
    ((obj as Record<string, unknown>).users as unknown[]).every((x) =>
      isUserWithLogined(x),
    )
  );
}
