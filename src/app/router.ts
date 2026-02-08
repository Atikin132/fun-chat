import { authController } from "../controllers/auth.controller.js";
import { Page } from "../types/page.type.js";
import App from "./app.js";

const routes: Record<string, Page> = {
  "/login": "login",
  "/main": "main",
  "/about": "about",
};

export class Router {
  constructor(private app: App) {}

  init(): void {
    authController.subscribe(() => {
      this.resolve();
    });

    document.addEventListener("click", (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const route = target.dataset.route;

      if (route !== undefined) {
        event.preventDefault();
        this.go(route);
      }

      if (target.dataset.back !== undefined) {
        event.preventDefault();
        this.back();
      }
    });

    window.addEventListener("hashchange", () => {
      this.resolve();
    });

    this.resolve();
  }

  private go(path: string): void {
    window.location.hash = path;
  }

  private back(): void {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.go("/main");
    }
  }

  private resolve(): void {
    const hash = window.location.hash;
    const path = hash ? hash.slice(1) : "/main";

    const page = routes[path];
    const user = authController.getUser();

    if (user && path === "/login") {
      this.app.navigate("main");
      window.location.hash = "#/main";
      return;
    }

    if (!user && !["/login", "/about"].includes(path)) {
      this.app.navigate("login");
      window.location.hash = "#/login";
      return;
    }

    if (!page) {
      this.app.navigate("main");
      window.location.hash = "#/main";
      return;
    }

    this.app.navigate(page);
  }
}
