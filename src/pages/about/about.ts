import AnchorCreator from "../../utils/anchor/anchor-creator.js";
import ButtonCreator from "../../utils/button/button-creator.js";
import ElementCreator from "../../utils/element-creator.js";
import HeadingsCreator from "../../utils/headings/headings-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import { BasePage } from "../base-page.js";
import "./about.css";

const HEADINGS_TWO = 2;

export class About extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("about-page");
    const aboutInfo = new ElementCreator({
      classes: ["about-info"],
      parent: this.container,
    }).getElement();

    const appTitle = new HeadingsCreator(HEADINGS_TWO, {
      parent: aboutInfo,
      classes: ["about-info__app-title"],
    }).getElement();
    appTitle.textContent = "Fun Chat";

    const aboutDescription = new ParagraphCreator({
      parent: aboutInfo,
      classes: ["about-description"],
    }).getElement();
    aboutDescription.textContent =
      "The application was developed during the training process within the RSSchool JS/FE 2025Q3 course.";

    const aboutAuthor = new ParagraphCreator({
      parent: aboutInfo,
      classes: ["about-author"],
      text: "Author: ",
    }).getElement();

    const githubLink = new AnchorCreator({
      parent: aboutAuthor,
      href: "https://github.com/Atikin132",
      target: "_blank",
    }).getElement();
    githubLink.classList.add("about-info__link");
    githubLink.textContent = "Atikin132";

    const backButton = new ButtonCreator({
      text: "Back",
      classes: ["about-info__back-button", "button"],
      parent: aboutInfo,
    }).getElement();
    backButton.dataset.back = "";
  }
}
