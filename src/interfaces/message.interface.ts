import { StatusMessage } from "./status-message.interface.js";

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: StatusMessage;
}
