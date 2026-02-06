import loginFormComponent from "../../components/login-form.component/login-form.component.js";
import notificationComponent from "../../components/notification.component/notification.component.js";
import { authController } from "../../controllers/auth.controller.js";
import { BasePage } from "../base-page.js";
import "./login.css";

export class Login extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("login-page");
    this.container.append(
      loginFormComponent(async () => {
        await this.login();
      }),
    );
  }

  async login() {
    try {
      const loginInput = this.container.querySelector<HTMLInputElement>(
        ".login-form__login-input",
      );
      const passwordInput = this.container.querySelector<HTMLInputElement>(
        ".login-form__password-input",
      );

      if (!loginInput || !passwordInput) {
        return;
      }

      await authController.login(loginInput.value, passwordInput.value);
    } catch (error) {
      if (error instanceof Error) {
        this.container.append(notificationComponent(error.message));
      } else {
        this.container.append(notificationComponent("Unknown error"));
      }
    }
  }
}
