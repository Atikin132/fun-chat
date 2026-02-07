import ElementCreator from "../../utils/element-creator.js";
import "./custom-context-menu.component.css";

export function customContextMenuComponent(
  editMessage: () => void,
  deleteMessage: () => Promise<void>,
): HTMLElement {
  const menu = new ElementCreator({
    classes: ["custom-context-menu"],
  }).getElement();

  const editItem = new ElementCreator({
    parent: menu,
    classes: ["custom-context-menu__edit-item"],
  }).getElement();

  editItem.textContent = "Edit";

  editItem.addEventListener("click", () => {
    void editMessage();
    menu.remove();
  });

  const deleteItem = new ElementCreator({
    parent: menu,
    classes: ["custom-context-menu__delete-item"],
  }).getElement();

  deleteItem.textContent = "Delete";

  deleteItem.addEventListener("click", () => {
    void deleteMessage();
    menu.remove();
  });

  return menu;
}
