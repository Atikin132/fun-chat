import { Screen } from "../interfaces/screen.interface.js";
import header from "../layout/header/header.js";
import MainCreator from "../utils/main/main-creator.js";
import "../styles/styles.css";

export default class App {
  private screens = new Map<string, Screen>();
  private current?: Screen;
  private root: HTMLElement;

  private headerElement?: HTMLElement;
  private main?: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  init(user: string): void {
    this.headerElement = header(user);
    this.main = new MainCreator({
      classes: ["main"],
    }).getElement();
    this.root.append(this.headerElement);
    this.root.append(this.main);
  }

  register(name: string, screen: Screen): void {
    this.screens.set(name, screen);
    if (this.main) {
      screen.create(this.main);
    }
    screen.hide();
  }

  navigate(pageName: string): void {
    const next = this.screens.get(pageName);
    if (!next) {
      return;
    }
    this.updateHeader(pageName);
    this.current?.hide();
    this.current = next;
    next.show();
  }

  private updateHeader(pageName: string): void {
    if (!this.headerElement) {
      return;
    }
    if (pageName === "about" || pageName === "login") {
      this.headerElement.classList.add("no-active");
    } else {
      this.headerElement.classList.remove("no-active");
    }
  }
}
