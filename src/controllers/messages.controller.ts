import { wsService } from "../services/websocket.service.js";
import { Message } from "../interfaces/message.interface.js";
import { isServerMessageTypePayload } from "../guards/is-server-message.guard.js";
import {
  isMessagePayload,
  isMessagesPayload,
} from "../guards/is-message-payload.guard.js";
import { authController } from "./auth.controller.js";

type MessageRenderHandler = () => void;

export class MessagesController {
  private dialogs = new Map<string, Message[]>();
  private myLogin = authController.getUser()?.login;

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

      const { type, payload } = data;

      switch (type) {
        case "MSG_SEND": {
          if (isMessagePayload(payload)) {
            this.onMessageReceived(payload.message);
          }
          break;
        }

        case "MSG_FROM_USER": {
          if (isMessagesPayload(payload)) {
            this.onMessagesHistory(payload.messages);
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
    const dialogKey = this.getDialogKey(message);
    const dialog = this.ensureDialog(dialogKey);

    dialog.push(message);
  }

  private onMessagesHistory(messages: Message[]) {
    if (messages.length === 0) return;
    if (messages[0] !== undefined) {
      const dialogKey = this.getDialogKey(messages[0]);
      this.dialogs.set(dialogKey, [...messages]);
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

  private getDialogKey(message: Message): string {
    return message.from === this.myLogin ? message.to : message.from;
  }
}

export const messagesController = new MessagesController();
