import { AuthResponse } from "../interfaces/auth.interface.js";
import { ServerMessage } from "../interfaces/server-message.interface.js";

export function isAuthResponse(msg: ServerMessage): msg is AuthResponse {
  return (
    (msg.type === "USER_LOGIN" || msg.type === "USER_LOGOUT") &&
    typeof msg.payload === "object" &&
    msg.payload !== null &&
    "user" in msg.payload
  );
}
