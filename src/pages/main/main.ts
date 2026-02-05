import dialogComponent from "../../components/dialog.component/dialog.component.js";
import sidebarComponent from "../../components/sidebar.component/sidebar.component.js";
import { authController } from "../../controllers/auth.controller.js";
import { usersController } from "../../controllers/users.controller.js";

import { BasePage } from "../base-page.js";
import "./main.css";

export class Main extends BasePage {
  private sidebar?: HTMLElement;

  private renderUsers(): void {
    if (this.sidebar) {
      this.sidebar.remove();
    }

    const usersWithoutCurrent = usersController.users.filter(
      (user) => user.login !== authController.getUser()?.login,
    );

    this.sidebar = sidebarComponent(usersWithoutCurrent);
    this.container.prepend(this.sidebar);
  }

  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("main-page");

    usersController.setRenderCallback(() => {
      this.renderUsers();
    });

    this.container.append(dialogComponent());
    this.renderUsers();
  }
}
