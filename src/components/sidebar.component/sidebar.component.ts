import { User } from "../../interfaces/user.interface.js";
import AsideCreator from "../../utils/aside/aside-creator.js";
import InputCreator from "../../utils/input/input-creator.js";
import UnorderedListCreator from "../../utils/unordered-list/unordered-list-creator.js";
import userSidebarComponent from "../user-sidebar.component/user-sidebar.component.js";
import "./sidebar.component.css";

const LOGIN_MAX_SIZE = "12";

export default function sidebarComponent(users: User[]): HTMLElement {
  const sidebar = new AsideCreator({
    classes: ["sidebar"],
  }).getElement();

  const searchInput = new InputCreator({
    parent: sidebar,
    classes: ["sidebar__search-input"],
    placeholder: "Search...",
  }).getElement();
  searchInput.type = "text";
  searchInput.name = "search";
  searchInput.setAttribute("maxlength", LOGIN_MAX_SIZE);
  searchInput.setAttribute("required", "true");
  searchInput.autocomplete = "off";

  const usersContainer = new UnorderedListCreator({
    parent: sidebar,
    classes: ["sidebar__users-container"],
  }).getElement();

  users.sort((a, b) => Number(b.isLogined) - Number(a.isLogined));

  for (const user of users) {
    usersContainer.append(userSidebarComponent(user));
  }
  return sidebar;
}
