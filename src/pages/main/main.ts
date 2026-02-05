import dialogComponent from "../../components/dialog.component/dialog.component.js";
import sidebarComponent from "../../components/sidebar.component/sidebar.component.js";
import { authController } from "../../controllers/auth.controller.js";
import { usersController } from "../../controllers/users.controller.js";
import { User } from "../../interfaces/user.interface.js";

import { BasePage } from "../base-page.js";
import "./main.css";

export class Main extends BasePage {
  private sidebar?: HTMLElement;
  private dialog?: HTMLElement;

  private renderUsers(): void {
    if (this.sidebar) {
      this.sidebar.remove();
    }

    const usersWithoutCurrent = usersController.users.filter(
      (user) => user.login !== authController.getUser()?.login,
    );

    this.sidebar = sidebarComponent(usersWithoutCurrent, (user: User) => {
      this.updateDialog(user);
    });
    this.container.prepend(this.sidebar);
  }

  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("main-page");

    usersController.setRenderCallback(() => {
      this.renderUsers();
    });
    this.dialog = dialogComponent();

    this.container.append(this.dialog);
    this.renderUsers();
  }

  updateDialog(user: User) {
    if (this.dialog) {
      this.dialog.remove();
    }
    this.dialog = dialogComponent(user);

    this.container.append(this.dialog);
  }
}
