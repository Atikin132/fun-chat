import { ErrorResponse } from "../interfaces/error.interface.js";
import { ServerMessage } from "../interfaces/server-message.interface.js";

export function isErrorResponse(msg: ServerMessage): msg is ErrorResponse {
  return msg.type === "ERROR";
}
