import { Screen } from "../interfaces/screen.interface.js";
import header from "../layout/header/header.js";
import MainCreator from "../utils/main/main-creator.js";
import "./app.css";
import footer from "../layout/footer/footer.js";
import { Page } from "../types/page.type.js";
import { authController } from "../controllers/auth.controller.js";

export default class App {
  private screens = new Map<Page, Screen>();
  private current?: Screen;
  private root: HTMLElement;

  private headerElement?: HTMLElement;
  private main?: HTMLElement;
  private footer?: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  init(): void {
    this.headerElement = header(
      authController.getUser()?.login ?? "",
      async () => {
        await authController.logout(
          authController.getUser()?.login ?? "",
          authController.getUser()?.password ?? "",
        );
      },
    );
    this.main = new MainCreator({
      classes: ["main"],
    }).getElement();
    this.footer = footer();
    this.root.append(this.headerElement);
    this.root.append(this.main);
    this.root.append(this.footer);
  }

  register(page: Page, screen: Screen): void {
    this.screens.set(page, screen);
    if (this.main) {
      screen.create(this.main);
    }
    screen.hide();
  }

  navigate(page: Page): void {
    const next = this.screens.get(page);
    if (!next) {
      return;
    }
    this.updateHeader(page);
    this.current?.hide();
    this.current = next;
    next.show();
  }

  private updateHeader(page: Page): void {
    if (!this.headerElement) {
      return;
    }
    if (page === "about" || page === "login") {
      this.headerElement.classList.add("none-display");
    } else {
      const newHeader = header(
        authController.getUser()?.login ?? "",
        async () => {
          await authController.logout(
            authController.getUser()?.login ?? "",
            authController.getUser()?.password ?? "",
          );
        },
      );
      this.headerElement.replaceWith(newHeader);
      this.headerElement = newHeader;
    }
  }
}
