import { wsService } from "../services/websocket.service.js";
import { User } from "../interfaces/user.interface.js";
import { isServerMessageTypePayload } from "../guards/is-server-message.guard.js";
import {
  UserAuthPayload,
  UsersPayload,
} from "../interfaces/user-payloads.interface.js";

type UserMessageHandler = () => void;

export class UsersController {
  users: User[] = [];

  private renderCallback?: UserMessageHandler | undefined;

  constructor(renderCallback?: UserMessageHandler) {
    this.renderCallback = renderCallback;
    this.subscribeToWS();
  }

  setRenderCallback(callback: UserMessageHandler) {
    this.renderCallback = callback;
  }

  private subscribeToWS() {
    wsService.onMessage((data: unknown) => {
      if (!isServerMessageTypePayload(data)) return;

      const { type, payload } = data;

      switch (type) {
        case "USER_EXTERNAL_LOGIN": {
          this.userExternalLogin(payload as UserAuthPayload);
          break;
        }
        case "USER_EXTERNAL_LOGOUT": {
          this.userExternalLogout(payload as UserAuthPayload);
          break;
        }
        case "USER_ACTIVE": {
          this.userActive(payload as UsersPayload);
          break;
        }
        case "USER_INACTIVE": {
          this.userInactive(payload as UsersPayload);
          break;
        }
      }

      this.renderCallback?.();
    });
  }

  userExternalLogin(payload: UserAuthPayload) {
    const incomingUser = payload.user;
    const index = this.users.findIndex(
      (user) => user.login === incomingUser.login,
    );

    if (index >= 0 && this.users[index]) {
      this.users[index].isLogined = incomingUser.isLogined ?? false;
    } else {
      this.users.push(incomingUser);
    }
  }

  userExternalLogout(payload: UserAuthPayload) {
    const outgoingUser = payload.user;
    const index = this.users.findIndex(
      (user) => user.login === outgoingUser.login,
    );

    if (index >= 0 && this.users[index]) {
      this.users[index].isLogined = outgoingUser.isLogined ?? false;
    }
  }

  userActive(payload: UsersPayload) {
    this.users.length = 0;
    this.users.push(...payload.users);
  }

  userInactive(payload: UsersPayload) {
    this.users.push(...payload.users);
  }
}

export const usersController = new UsersController();
