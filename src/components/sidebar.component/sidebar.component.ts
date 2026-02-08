import { User } from "../../interfaces/user.interface.js";
import AsideCreator from "../../utils/aside/aside-creator.js";
import InputCreator from "../../utils/input/input-creator.js";
import UnorderedListCreator from "../../utils/unordered-list/unordered-list-creator.js";
import userSidebarComponent from "../user-sidebar.component/user-sidebar.component.js";
import "./sidebar.component.css";

const LOGIN_MAX_SIZE = "12";

function renderUserList(
  usersContainer: HTMLElement,
  filteredUsers: User[],
  userUnreadCountMap: Map<string, number>,
) {
  usersContainer.innerHTML = "";
  filteredUsers.sort((a, b) => Number(b.isLogined) - Number(a.isLogined));
  for (const user of filteredUsers) {
    usersContainer.append(
      userSidebarComponent(user, userUnreadCountMap.get(user.login) ?? 0),
    );
  }
}

export default function sidebarComponent(
  users: User[],
  updateDialog: (user: User) => void,
  userUnreadCountMap: Map<string, number>,
): HTMLElement {
  const sidebar = new AsideCreator({
    classes: ["sidebar"],
  }).getElement();

  sidebar.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const userSidebarContainer = target.closest<HTMLElement>(
      ".user-sidebar-container",
    );
    if (userSidebarContainer) {
      updateDialog({
        login: userSidebarContainer.dataset.login ?? "",
        isLogined: userSidebarContainer.dataset.status === "true",
      });
    } else {
      return;
    }
  });

  const searchInput = new InputCreator({
    parent: sidebar,
    classes: ["sidebar__search-input"],
    placeholder: "Search...",
  }).getElement();
  searchInput.type = "text";
  searchInput.name = "search";
  searchInput.setAttribute("maxlength", LOGIN_MAX_SIZE);
  searchInput.autocomplete = "off";

  const usersContainer = new UnorderedListCreator({
    parent: sidebar,
    classes: ["sidebar__users-container"],
  }).getElement();

  renderUserList(usersContainer, users, userUnreadCountMap);

  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    if (searchValue) {
      const filteredUsers = users.filter((user) =>
        user.login.toLowerCase().includes(searchValue),
      );
      renderUserList(usersContainer, filteredUsers, userUnreadCountMap);
    } else {
      renderUserList(usersContainer, users, userUnreadCountMap);
    }
  });

  return sidebar;
}
