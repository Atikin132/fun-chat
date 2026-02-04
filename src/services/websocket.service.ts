import { WSHandler } from "../types/websocket-handler.type.js";

export class WebSocketService {
  private socket: WebSocket = new WebSocket("ws://localhost:4000");
  private handlers: WSHandler<unknown>[] = [];
  private connectPromise: Promise<void>;

  constructor() {
    this.connectPromise = new Promise((resolve) => {
      this.socket.addEventListener("open", () => resolve());
    });

    this.socket.addEventListener("message", (event: MessageEvent<string>) => {
      let data: unknown;

      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }

      for (const handler of this.handlers) {
        handler(data);
      }
    });
  }

  async send(data: unknown): Promise<void> {
    await this.connectPromise;
    this.socket.send(JSON.stringify(data));
  }

  onMessage(handler: WSHandler<unknown>): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: WSHandler<unknown>): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
}

export const wsService = new WebSocketService();
