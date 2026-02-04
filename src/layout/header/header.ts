import HeaderCreator from "../../utils/header/header-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import NavigationCreator from "../../utils/navigation/navigation-creator.js";
import UnorderedListCreator from "../../utils/unordered-list/unordered-list-creator.js";
import ListItemCreator from "../../utils/list-item/list-item-creator.js";
import ButtonCreator from "../../utils/button/button-creator.js";
import HeadingsCreator from "../../utils/headings/headings-creator.js";
import "./header.css";

const HEADINGS_ONE = 1;

export default function header(
  user: string,
  logout: () => Promise<void>,
): HTMLElement {
  const headerCreator = new HeaderCreator({
    classes: ["header"],
  });

  const userName = new ParagraphCreator({
    parent: headerCreator.getElement(),
    classes: ["user-name"],
  }).getElement();

  userName.textContent = user === "" ? "" : `User: ${user}`;

  const appTitle = new HeadingsCreator(HEADINGS_ONE, {
    parent: headerCreator.getElement(),
    classes: ["app-title"],
  }).getElement();

  appTitle.textContent = "Fun Chat";

  const nav = new NavigationCreator({
    parent: headerCreator.getElement(),
    classes: ["nav"],
  }).getElement();

  const ul = new UnorderedListCreator({
    parent: nav,
    classes: ["header-menu"],
  }).getElement();

  const aboutLi = new ListItemCreator({
    parent: ul,
  }).getElement();

  const logoutLi = new ListItemCreator({
    parent: ul,
  }).getElement();

  const aboutButton = new ButtonCreator({
    parent: aboutLi,
    classes: ["about-button", "button"],
  }).getElement();

  aboutButton.dataset.route = "/about";

  const logoutButton = new ButtonCreator({
    parent: logoutLi,
    classes: ["logout-button", "button"],
  }).getElement();
  logoutButton.addEventListener("click", () => {
    void logout();
  });

  return headerCreator.getElement();
}
