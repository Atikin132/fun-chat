import { User } from "./user.interface.js";

export interface AuthRequest {
  id: string;
  type: "USER_LOGIN" | "USER_LOGOUT";
  payload: {
    user: {
      login: string;
      password: string;
    };
  };
}

export interface AuthResponse {
  id: string;
  type: "USER_LOGIN" | "USER_LOGOUT";
  payload: {
    user: User;
  };
}
