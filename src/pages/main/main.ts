import dialogComponent from "../../components/dialog.component/dialog.component.js";
import messageComponent from "../../components/message.component/message.component.js";
import sidebarComponent from "../../components/sidebar.component/sidebar.component.js";
import { authController } from "../../controllers/auth.controller.js";
import { messagesController } from "../../controllers/messages.controller.js";
import { usersController } from "../../controllers/users.controller.js";
import { User } from "../../interfaces/user.interface.js";
import { messagesService } from "../../services/messages.service.js";
import { scrollToBottom } from "../../utils/scroll-to-bottom.js";

import { BasePage } from "../base-page.js";
import "./main.css";

export class Main extends BasePage {
  private sidebar?: HTMLElement;
  private dialog?: HTMLElement;
  private currentSelectedUser?: User;

  private renderUsers(): void {
    if (this.sidebar) {
      this.sidebar.remove();
    }

    const usersWithoutCurrent = usersController.users.filter(
      (user) => user.login !== authController.getUser()?.login,
    );

    this.sidebar = sidebarComponent(usersWithoutCurrent, (user: User) => {
      void messagesService.fetchHistory(user.login);
      messagesController.withUser = user;
      this.currentSelectedUser = user;
    });
    this.container.prepend(this.sidebar);
  }

  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("main-page");

    usersController.setRenderCallback(() => {
      this.renderUsers();
    });
    messagesController.setRenderCallback(() => {
      this.renderDialog(this.currentSelectedUser);
    });

    this.dialog = dialogComponent();

    this.container.append(this.dialog);
    this.renderUsers();
  }

  private renderDialog(user?: User) {
    if (this.dialog) {
      this.dialog.remove();
    }

    this.dialog = dialogComponent(user, async (text: string) => {
      if (this.currentSelectedUser?.login !== undefined) {
        await messagesService.sendMessage(this.currentSelectedUser.login, text);
      }
    });

    const messagesContainer = this.dialog.querySelector<HTMLElement>(
      ".messages-container",
    );

    if (user?.login !== undefined) {
      const messages = messagesController.getDialog(user?.login ?? "");
      for (const message of messages) {
        messagesContainer?.append(
          messageComponent(
            authController.getUser()?.login ?? "",
            message,
            message.from === authController.getUser()?.login,
          ),
        );
      }
    }

    this.container.append(this.dialog);
    scrollToBottom(messagesContainer);
  }
}
