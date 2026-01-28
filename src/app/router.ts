import App from "./app.js";

const BASE_PATH = "/atikin132-JSFE2025Q3/fun-chat";

const routes: Record<string, string> = {
  "/login": "login",
  "/main": "main",
  "/about": "about",
};

export class Router {
  constructor(private app: App) {}

  init(): void {
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

    window.addEventListener("popstate", () => {
      this.resolve();
    });

    this.resolve();
  }

  private go(path: string): void {
    history.pushState(undefined, "", `${BASE_PATH}${path}`);
    this.resolve();
  }

  private back(): void {
    if (history.length > 1) {
      history.back();
    } else {
      this.go("/main");
    }
  }

  private resolve(): void {
    const fullPath = window.location.pathname;
    const path = fullPath.startsWith(BASE_PATH)
      ? fullPath.slice(BASE_PATH.length)
      : fullPath;
    const normalizedPath = path === "" || path === "/" ? "/main" : path;
    const page = routes[normalizedPath];

    if (page === undefined) {
      this.app.navigate("main");
      history.replaceState(undefined, "", `${BASE_PATH}/main`);
      return;
    }

    this.app.navigate(page);
  }
}
