import { User } from "../../interfaces/user.interface.js";
import ElementCreator from "../../utils/element-creator.js";
import ListItemCreator from "../../utils/list-item/list-item-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import "./user-sidebar.component.css";

export default function userSidebarComponent(user: User): HTMLElement {
  const userContainer = new ListItemCreator({
    classes: ["user-sidebar-container"],
  }).getElement();

  const status = new ElementCreator({
    parent: userContainer,
    classes: ["user-sidebar-container__status"],
  }).getElement();
  if (user.isLogined !== undefined && user.isLogined) {
    status.classList.add("logined");
  }

  const userMessageContainer = new ElementCreator({
    parent: userContainer,
    classes: ["user-sidebar-container__user-message-container"],
  }).getElement();

  const name = new ParagraphCreator({
    parent: userMessageContainer,
    classes: ["user-sidebar-container__name"],
  }).getElement();
  name.textContent = user.login;

  const message = new ElementCreator({
    parent: userMessageContainer,
    classes: ["user-sidebar-container__message"],
  }).getElement();
  message.classList.add("no-message");

  return userContainer;
}
