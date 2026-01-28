import { BasePage } from "../base-page.js";

export class Login extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.innerHTML = `
      <h2>Login</h2>
      <button data-route="/main">Go to Main</button>
      <button data-route="/about">Go to About</button>
    `;
  }
}
