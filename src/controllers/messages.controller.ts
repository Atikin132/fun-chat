import { wsService } from "../services/websocket.service.js";
import { Message } from "../interfaces/message.interface.js";
import { isServerMessageTypePayload } from "../guards/is-server-message.guard.js";
import {
  isMessagePayload,
  isMessagesPayload,
} from "../guards/is-message-payload.guard.js";
import { User } from "../interfaces/user.interface.js";
import { authController } from "./auth.controller.js";
import { generateId } from "../utils/id-generator.js";
import { isUnreadCountPayload } from "../guards/is-unread-count-payload.js";
import { messagesService } from "../services/messages.service.js";
import { usersController } from "./users.controller.js";

type MessageRenderHandler = () => void;

export class MessagesController {
  private dialogs = new Map<string, Message[]>();
  withUser?: User;
  private unreadCountMap = new Map<string, string>();
  userUnreadCountMap = new Map<string, number>();
  currentSelectedUser?: User;

  private renderCallback?: MessageRenderHandler | undefined;

  constructor(renderCallback?: MessageRenderHandler) {
    this.renderCallback = renderCallback;
    this.subscribeToWS();
  }

  setRenderCallback(callback: MessageRenderHandler) {
    this.renderCallback = callback;
  }

  getDialog(withUser: string): Message[] {
    return this.dialogs.get(withUser) ?? [];
  }

  private subscribeToWS() {
    wsService.onMessage((data: unknown) => {
      if (!isServerMessageTypePayload(data)) return;

      const { id, type, payload } = data;

      switch (type) {
        case "MSG_SEND": {
          if (isMessagePayload(payload)) {
            this.onMessageReceived(payload.message);
            if (payload.message.from === this.currentSelectedUser?.login) {
              void messagesService.markAsRead(payload.message.id);
            }
            this.fetchOneUnreadCount(payload.message.from);
          }
          break;
        }

        case "MSG_COUNT_NOT_READED_FROM_USER": {
          if (isUnreadCountPayload(payload) && id !== null) {
            this.onUnreadCount(payload.count, id);
          }
          break;
        }

        case "MSG_FROM_USER": {
          if (isMessagesPayload(payload)) {
            this.onMessagesHistory(
              payload.messages,
              this.withUser?.login ?? "",
            );
            if (this.currentSelectedUser?.login !== undefined) {
              for (const message of payload.messages) {
                void messagesService.markAsRead(message.id);
              }
              this.fetchOneUnreadCount(this.withUser?.login ?? "");
            }
          }
          break;
        }

        case "MSG_DELIVER": {
          if (isMessagePayload(payload)) {
            this.onMessageDelivered(payload.message.id);
          }
          break;
        }

        case "MSG_READ": {
          if (isMessagePayload(payload)) {
            this.onMessageRead(payload.message.id);
          }
          break;
        }

        case "MSG_DELETE": {
          if (isMessagePayload(payload)) {
            this.onMessageDeleted(payload.message.id);
            if (id === null) {
              this.fetchAllUnreadCount(usersController.users);
            }
          }
          break;
        }

        case "MSG_EDIT": {
          if (isMessagePayload(payload)) {
            this.onMessageEdited(payload.message);
          }
          break;
        }
      }

      this.renderCallback?.();
    });
  }

  private onMessageReceived(message: Message) {
    const otherUser =
      message.from === authController.getUser()?.login
        ? message.to
        : message.from;
    const dialog = this.ensureDialog(otherUser);

    dialog.push(message);
  }

  private onUnreadCount(count: number, id: string) {
    const login = this.unreadCountMap.get(id);
    if (login !== undefined) {
      this.userUnreadCountMap.set(login, count);
      this.unreadCountMap.delete(id);
    }
  }

  fetchOneUnreadCount(userLogin: string) {
    if (userLogin === authController.getUser()?.login) {
      return;
    }
    const id = generateId();
    this.unreadCountMap.set(id, userLogin);
    void messagesService.fetchUnreadCount(id, userLogin);
  }

  fetchAllUnreadCount(users: User[]) {
    for (const user of users) {
      this.fetchOneUnreadCount(user.login);
    }
  }

  private onMessagesHistory(messages: Message[], requestedUserLogin: string) {
    if (messages.length === 0) return;

    this.dialogs.set(requestedUserLogin, [...messages]);
  }

  fetchAllHistory(users: User[]) {
    for (const user of users) {
      void messagesService.fetchHistory(user.login);
    }
  }

  private onMessageDelivered(messageId: string) {
    this.updateMessage(messageId, (msg) => {
      msg.status.isDelivered = true;
    });
  }

  private onMessageRead(messageId: string) {
    this.updateMessage(messageId, (msg) => {
      msg.status.isReaded = true;
    });
  }

  private onMessageDeleted(messageId: string) {
    this.updateMessage(messageId, (msg) => {
      msg.status.isDeleted = true;
    });
  }

  private onMessageEdited(message: Message) {
    this.updateMessage(message.id, (msg) => {
      msg.text = message.text;
      msg.status.isEdited = true;
    });
  }

  private ensureDialog(user: string): Message[] {
    const existing = this.dialogs.get(user);
    if (existing) return existing;

    const created: Message[] = [];
    this.dialogs.set(user, created);
    return created;
  }

  private updateMessage(messageId: string, updater: (msg: Message) => void) {
    for (const dialog of this.dialogs.values()) {
      const msg = dialog.find((m) => m.id === messageId);
      if (msg) {
        updater(msg);
        return;
      }
    }
  }
}

export const messagesController = new MessagesController();
