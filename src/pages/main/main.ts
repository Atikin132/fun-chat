import { BasePage } from "../base-page.js";

export class Main extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.innerHTML = `
      <h2>Main</h2>`;
  }
}
