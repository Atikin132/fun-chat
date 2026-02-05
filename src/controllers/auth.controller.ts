import { isUser } from "../guards/is-user.guard.js";
import { User } from "../interfaces/user.interface.js";
import { authService, AuthService } from "../services/auth.service.js";
import { AuthListener } from "../types/auth-listener.type.js";

export class AuthController {
  private currentUser: User | undefined = undefined;
  private listeners: AuthListener[] = [];

  constructor(private authService: AuthService) {}

  async login(login: string, password: string): Promise<void> {
    const user = await this.authService.login(login, password);
    this.currentUser = user;
    this.currentUser.password = password;
    sessionStorage.setItem("user", JSON.stringify(user));
    await this.authService.getActiveInactiveUsers();
    this.notify();
  }

  async logout(login: string, password: string): Promise<void> {
    const user = await this.authService.logout(login, password);

    if (user.isLogined !== undefined && user.isLogined) {
      this.currentUser = user;
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      this.currentUser = undefined;
      sessionStorage.removeItem("user");
    }

    this.notify();
  }

  getUser(): User | undefined {
    return this.currentUser;
  }

  subscribe(listener: AuthListener): void {
    this.listeners.push(listener);
  }

  restore(): void {
    const userSessionStorage = sessionStorage.getItem("user");
    if (userSessionStorage === null) {
      return;
    }
    let parsedUser: unknown;

    try {
      parsedUser = JSON.parse(userSessionStorage);
    } catch {
      sessionStorage.removeItem("user");
      return;
    }

    if (isUser(parsedUser)) {
      this.currentUser = parsedUser;
      void this.login(this.currentUser.login, this.currentUser.password ?? "");
    } else {
      sessionStorage.removeItem("user");
    }
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.currentUser);
    }
  }
}

export const authController = new AuthController(authService);
