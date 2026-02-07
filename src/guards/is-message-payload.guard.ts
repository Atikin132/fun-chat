import {
  MessagePayload,
  MessagesPayload,
} from "../interfaces/message-payloads.interface.js";
import { isMessage } from "./is-message.guard.js";

export function isMessagePayload(obj: unknown): obj is MessagePayload {
  return typeof obj === "object" && obj !== null && "message" in obj;
}

export function isMessagesPayload(obj: unknown): obj is MessagesPayload {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "messages" in obj &&
    Array.isArray((obj as Record<string, unknown>).messages) &&
    ((obj as Record<string, unknown>).messages as unknown[]).every((x) =>
      isMessage(x),
    )
  );
}
