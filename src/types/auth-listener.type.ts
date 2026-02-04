import { User } from "../interfaces/user.interface.js";

export type AuthListener = (user: User | undefined) => void;
