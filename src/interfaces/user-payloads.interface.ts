import { User } from "./user.interface.js";

export interface UserAuthPayload {
  user: User;
}
export interface UsersPayload {
  users: User[];
}
