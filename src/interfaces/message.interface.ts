import { MessageStatus } from "./message-status.interface.js";

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: MessageStatus;
}
