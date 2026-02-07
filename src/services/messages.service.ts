import { generateId } from "../utils/id-generator.js";
import { wsService } from "./websocket.service.js";

export class MessagesService {
  async sendMessage(to: string, text: string) {
    await wsService.send({
      id: generateId(),
      type: "MSG_SEND",
      payload: {
        message: { to, text },
      },
    });
  }

  async fetchHistory(fromUser: string) {
    await wsService.send({
      id: generateId(),
      type: "MSG_FROM_USER",
      payload: {
        user: { login: fromUser },
      },
    });
  }

  async fetchUnreadCount(fromUser: string) {
    await wsService.send({
      id: generateId(),
      type: "MSG_COUNT_NOT_READED_FROM_USER",
      payload: {
        user: { login: fromUser },
      },
    });
  }

  async markAsRead(messageId: string) {
    await wsService.send({
      id: generateId(),
      type: "MSG_READ",
      payload: {
        message: { id: messageId },
      },
    });
  }

  async deleteMessage(messageId: string) {
    await wsService.send({
      id: generateId(),
      type: "MSG_DELETE",
      payload: {
        message: { id: messageId },
      },
    });
  }

  async editMessage(messageId: string, text: string) {
    await wsService.send({
      id: generateId(),
      type: "MSG_EDIT",
      payload: {
        message: { id: messageId, text },
      },
    });
  }
}

export const messagesService = new MessagesService();
