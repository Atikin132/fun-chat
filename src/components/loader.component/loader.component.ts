import ElementCreator from "../../utils/element-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import "./loader.component.css";

export default function loaderComponent(): HTMLElement {
  const loaderOverlay = new ElementCreator({
    classes: ["loader-overlay"],
  }).getElement();

  const loaderContainer = new ElementCreator({
    classes: ["loader-container"],
    parent: loaderOverlay,
  }).getElement();

  const loaderText = new ParagraphCreator({
    classes: ["loader-container__text"],
    parent: loaderContainer,
  }).getElement();
  loaderText.textContent = "Connecting...";

  const spinner = new ElementCreator({
    parent: loaderContainer,
  }).getElement();
  spinner.classList.add("spinner");

  return loaderOverlay;
}
