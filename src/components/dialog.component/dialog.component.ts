import { User } from "../../interfaces/user.interface.js";
import ButtonCreator from "../../utils/button/button-creator.js";
import ElementCreator from "../../utils/element-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import TextAreaCreator from "../../utils/text-area/text-area-creator.js";
import "./dialog.component.css";

export default function dialogComponent(
  user?: User,
  sendMessage?: (text: string) => Promise<void>,
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
