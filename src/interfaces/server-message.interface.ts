export interface ServerMessage {
  id: string | null;
  type: string;
  payload: unknown;
}
