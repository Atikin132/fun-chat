import { Message } from "./message.interface.js";

export interface MessagePayload {
  message: Message;
}

export interface MessagesPayload {
  messages: Message[];
}

export interface MessageCountPayload {
  count: number;
}
