import { Message } from "../../interfaces/message.interface.js";
import ElementCreator from "../../utils/element-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import "./message.component.css";

export default function messageComponent(
  message: Message,
  isOutgoing: boolean,
): HTMLElement {
  const messageContainer = new ElementCreator({
    classes: ["message-container"],
  }).getElement();
  if (isOutgoing) {
    messageContainer.classList.add("outgoing");
  } else {
    messageContainer.classList.add("incoming");
  }

  const fromDateContainer = new ElementCreator({
    parent: messageContainer,
    classes: ["from-date-container"],
  }).getElement();

  const from = new ParagraphCreator({
    classes: ["from-date-container__from"],
    parent: fromDateContainer,
  }).getElement();
  from.textContent = message.from;

  const date = new ParagraphCreator({
    classes: ["from-date-container__date"],
    parent: fromDateContainer,
  }).getElement();
  date.textContent = message.datetime.toString();

  const text = new ParagraphCreator({
    classes: ["message-container__text"],
    parent: messageContainer,
  }).getElement();
  text.textContent = message.text;

  const conditionStatusContainer = new ElementCreator({
    parent: messageContainer,
    classes: ["condition-status-container"],
  }).getElement();

  if (message.status.isEdited) {
    const condition = new ParagraphCreator({
      classes: ["condition-status-container__condition"],
      parent: conditionStatusContainer,
    }).getElement();
    condition.textContent = "Changed";
  }

  const status = new ParagraphCreator({
    classes: ["condition-status-container__status"],
    parent: conditionStatusContainer,
  }).getElement();
  if (message.status.isDelivered) {
    status.textContent = "Delivered";
  }
  if (message.status.isReaded) {
    status.textContent = "Readed";
  }

  return messageContainer;
}
