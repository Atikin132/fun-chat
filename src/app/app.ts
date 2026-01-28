import { Screen } from "../interfaces/screen.interface.js";

export default class App {
  private screens = new Map<string, Screen>();
  private current?: Screen;
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  register(name: string, screen: Screen): void {
    this.screens.set(name, screen);
    screen.create(this.root);
    screen.hide();
  }

  navigate(name: string): void {
    const next = this.screens.get(name);
    if (!next) {
      return;
    }

    this.current?.hide();
    this.current = next;
    next.show();
  }
}
