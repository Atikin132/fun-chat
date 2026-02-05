import { isAuthResponse } from "../guards/is-auth-response.guard.js";
import { isErrorResponse } from "../guards/is-error-response.js";
import { isServerMessage } from "../guards/is-server-message.guard.js";
import { AuthRequest } from "../interfaces/auth.interface.js";
import { User } from "../interfaces/user.interface.js";
import { generateId } from "../utils/id-generator.js";
import { WebSocketService, wsService } from "./websocket.service.js";

export class AuthService {
  constructor(private ws: WebSocketService) {}

  login(login: string, password: string): Promise<User> {
    return this.sendAuthRequest("USER_LOGIN", login, password);
  }

  logout(login: string, password: string): Promise<User> {
    return this.sendAuthRequest("USER_LOGOUT", login, password);
  }

  async getActiveInactiveUsers(): Promise<void> {
    await wsService.send({
      id: generateId(),
      type: "USER_ACTIVE",
      payload: null,
    });

    await wsService.send({
      id: generateId(),
      type: "USER_INACTIVE",
      payload: null,
    });
  }

  private sendAuthRequest(
    type: "USER_LOGIN" | "USER_LOGOUT",
    login: string,
    password: string,
  ): Promise<User> {
    const id = generateId();

    const request: AuthRequest = {
      id,
      type,
      payload: {
        user: { login, password },
      },
    };

    return new Promise((resolve, reject) => {
      const handler = (data: unknown) => {
        if (!isServerMessage(data)) {
          return;
        }
        if (data.id !== id) {
          return;
        }

        if (isErrorResponse(data)) {
          reject(new Error(data.payload.error));
          this.ws.removeHandler(handler);
          return;
        }

        if (isAuthResponse(data) && data.type === type) {
          resolve(data.payload.user);
          this.ws.removeHandler(handler);
        }
      };

      this.ws.onMessage(handler);
      void this.ws.send(request);
    });
  }
}

export const authService = new AuthService(wsService);
