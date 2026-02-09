import { wsService } from "../services/websocket.service.js";
import { User } from "../interfaces/user.interface.js";
import { isServerMessageTypePayload } from "../guards/is-server-message.guard.js";
import {
  UserAuthPayload,
  UsersPayload,
} from "../interfaces/user-payloads.interface.js";
import {
  isUserAuthPayload,
  isUsersPayload,
} from "../guards/is-user-payload.guard.js";
import { messagesController } from "./messages.controller.js";

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
          if (isUserAuthPayload(payload)) {
            this.userExternalLogin(payload);
          }
          break;
        }
        case "USER_EXTERNAL_LOGOUT": {
          if (isUserAuthPayload(payload)) {
            this.userExternalLogout(payload);
          }
          break;
        }
        case "USER_ACTIVE": {
          if (isUsersPayload(payload)) {
            this.userActive(payload);
          }
          break;
        }
        case "USER_INACTIVE": {
          if (isUsersPayload(payload)) {
            this.userInactive(payload);
            messagesController.fetchAllUnreadCount(usersController.users);
            messagesController.fetchAllHistory(usersController.users);
          }
          break;
        }
      }

      this.renderCallback?.();
    });
  }

  userExternalLogin(payload: UserAuthPayload) {
    const incomingUser = payload.user;
    this.changeUserLogined(incomingUser, true);
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
    this.changeUserLogined(outgoingUser, false);
    const index = this.users.findIndex(
      (user) => user.login === outgoingUser.login,
    );

    if (index >= 0 && this.users[index]) {
      this.users[index].isLogined = outgoingUser.isLogined ?? false;
    }
  }

  private changeUserLogined(userExternal: User, isLogined: boolean) {
    if (userExternal.login === messagesController.currentSelectedUser?.login) {
      messagesController.currentSelectedUser.isLogined = isLogined;
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
