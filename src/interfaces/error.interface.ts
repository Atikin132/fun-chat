export interface ErrorResponse {
  id: string;
  type: "ERROR";
  payload: {
    error: string;
  };
}
