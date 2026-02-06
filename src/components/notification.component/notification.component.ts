import ButtonCreator from "../../utils/button/button-creator.js";
import ElementCreator from "../../utils/element-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import "./notification.component.css";

export default function notificationComponent(
  notificationMessage: string,
): HTMLElement {
  const notificationOverlay = new ElementCreator({
    classes: ["notification-overlay"],
  }).getElement();

  const notificationContainer = new ElementCreator({
    classes: ["notification-container"],
    parent: notificationOverlay,
  }).getElement();

  const message = new ParagraphCreator({
    parent: notificationContainer,
    classes: ["notification-container__message"],
  }).getElement();
  const messageText =
    notificationMessage.charAt(0).toUpperCase() + notificationMessage.slice(1);
  message.textContent = messageText;

  const okButton = new ButtonCreator({
    parent: notificationContainer,
    text: "OK",
    classes: ["ok-button", "button"],
  }).getElement();

  okButton.addEventListener("click", () => {
    notificationOverlay.remove();
  });

  return notificationOverlay;
}
