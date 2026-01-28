import { BasePage } from "../base-page.js";

export class About extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.innerHTML = `
      <h2>About</h2>
      <button data-back>Go Back</button>
    `;
  }
}
