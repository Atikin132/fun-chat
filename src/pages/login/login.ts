import loginFormComponent from "../../components/login-form.component/login-form.component.js";
import { BasePage } from "../base-page.js";
import "./login.css";

export class Login extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("login-page");
    this.container.append(loginFormComponent());
  }
}
