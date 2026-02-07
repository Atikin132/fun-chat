import { User } from "../../interfaces/user.interface.js";
import { messagesService } from "../../services/messages.service.js";
import ButtonCreator from "../../utils/button/button-creator.js";
import ElementCreator from "../../utils/element-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import { showContextMenu } from "../../utils/show-custom-context-menu.js";
import TextAreaCreator from "../../utils/text-area/text-area-creator.js";
import { customContextMenuComponent } from "../custom-menu.component/custom-context-menu.component.js";
import "./dialog.component.css";

export const messageEdit = { id: "", text: "" };

export default function dialogComponent(
  user?: User,
  sendMessage?: (text: string) => Promise<void>,
  isNoMessages?: boolean,
): HTMLElement {
  const dialogContainer = new ElementCreator({
    classes: ["dialog-container"],
  }).getElement();

  const selectedUser = new ElementCreator({
    parent: dialogContainer,
    classes: ["dialog-container__selected-user"],
  }).getElement();

  const username = new ParagraphCreator({
    parent: selectedUser,
    classes: ["selected-user__username"],
  }).getElement();
  if (user) {
    username.textContent = user.login;
  }

  const userStatus = new ParagraphCreator({
    parent: selectedUser,
    classes: ["selected-user__user-status"],
  }).getElement();
  userStatus.textContent = "offline";
  if (user && user.isLogined !== undefined && user.isLogined) {
    userStatus.textContent = "online";
    userStatus.classList.add("logined");
  } else if (user === undefined) {
    userStatus.textContent = "";
  }

  const messagesContainer = new ElementCreator({
    parent: dialogContainer,
    classes: ["messages-container"],
  }).getElement();
  if (user === undefined) {
    const noSelectedUserText = new ParagraphCreator({
      parent: messagesContainer,
      classes: ["messages-container__no-selected-user-text"],
    }).getElement();
    noSelectedUserText.textContent = "Select a user to send the message...";
  }
  if (isNoMessages !== undefined && isNoMessages) {
    const noMessageText = new ParagraphCreator({
      parent: messagesContainer,
      classes: ["messages-container__no-message-text"],
    }).getElement();
    noMessageText.textContent = "Write your first message...";
  }

  messagesContainer.addEventListener("contextmenu", (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const messageContainer = target.closest<HTMLElement>(".message-container");
    if (messageContainer && messageContainer.classList.contains("outgoing")) {
      event.preventDefault();

      const menu = customContextMenuComponent(
        () => {
          messageEdit.id = messageContainer.dataset.id ?? "";
          const textArea = document.querySelector<HTMLTextAreaElement>(
            ".text-area-send-container__message-text-area",
          );
          if (textArea) {
            const messageText =
              messageContainer.querySelector(".message-container__text")
                ?.textContent ?? "";
            textArea.value = messageText;
            messageEdit.text = messageText;
          }
        },
        async () => {
          await messagesService.deleteMessage(
            messageContainer.dataset.id ?? "",
          );
        },
      );

      showContextMenu(menu, event.pageX, event.pageY);
    }
  });

  const textAreaSendContainer = new ElementCreator({
    parent: dialogContainer,
    classes: ["text-area-send-container"],
  }).getElement();

  const messageTextArea = new TextAreaCreator({
    parent: textAreaSendContainer,
    classes: ["text-area-send-container__message-text-area", "textarea"],
    placeholder: "Your message...",
  }).getElement();
  messageTextArea.name = "message";
  messageTextArea.autocomplete = "off";

  const sendButton = new ButtonCreator({
    parent: textAreaSendContainer,
    classes: ["text-area-send-container__send-button", "button"],
  }).getElement();
  sendButton.classList.add("no-active");
  sendButton.disabled = true;

  sendButton.addEventListener("click", () => {
    if (sendMessage) {
      void sendMessage(messageTextArea.value);
    }
  });

  dialogContainer.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    if (sendButton.disabled) return;

    event.preventDefault();
    if (sendMessage) {
      void sendMessage(messageTextArea.value);
    }
  });

  if (user === undefined) {
    messageTextArea.classList.add("no-active");
    messageTextArea.disabled = true;
  }

  messageTextArea.addEventListener("input", () => {
    const hasText = messageTextArea.value.trim().length > 0;
    sendButton.disabled = !hasText;
    sendButton.classList.toggle("no-active", !hasText);
  });

  return dialogContainer;
}
