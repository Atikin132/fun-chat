import { WSHandler } from "../types/websocket-handler.type.js";
import { WSStatus } from "../types/websocket-status.enum.js";

const RECONNECT_DELAY = 3000;
export class WebSocketService {
  private socket?: WebSocket;
  private handlers: WSHandler<unknown>[] = [];
  private connectPromise?: Promise<void>;
  private statusHandlers: ((status: WSStatus) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    this.emitStatus(WSStatus.CONNECTING);

    this.socket = new WebSocket("ws://localhost:4000");

    this.connectPromise = new Promise((resolve) => {
      this.socket?.addEventListener("open", () => {
        this.emitStatus(WSStatus.OPEN);

        resolve();
      });
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

    this.socket.addEventListener("close", () => {
      this.emitStatus(WSStatus.CLOSED);
      setTimeout(() => this.connect(), RECONNECT_DELAY);
    });

    this.socket.addEventListener("error", () => {
      this.socket?.close();
    });
  }

  async send(data: unknown): Promise<void> {
    await this.connectPromise;
    this.socket?.send(JSON.stringify(data));
  }

  onMessage(handler: WSHandler<unknown>): void {
    this.handlers.push(handler);
  }

  removeHandler(handler: WSHandler<unknown>): void {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }

  onStatusChange(handler: (status: WSStatus) => void) {
    this.statusHandlers.push(handler);
  }

  private emitStatus(status: WSStatus) {
    for (const handler of this.statusHandlers) {
      handler(status);
    }
  }
}

export const wsService = new WebSocketService();
