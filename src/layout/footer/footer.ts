import FooterCreator from "../../utils/footer/footer-creator.js";
import ParagraphCreator from "../../utils/paragraph/paragraph-creator.js";
import AnchorCreator from "../../utils/anchor/anchor-creator.js";
import "./footer.css";

export default function footer(): HTMLElement {
  const footerCreator = new FooterCreator({
    classes: ["footer"],
  });

  const year = new ParagraphCreator({
    parent: footerCreator.getElement(),
  }).getElement();
  year.textContent = "© 2026";

  const rsLink = new AnchorCreator({
    parent: footerCreator.getElement(),
    href: "https://rs.school/",
    target: "_blank",
  }).getElement();
  rsLink.classList.add("rs-logo");

  const githubLink = new AnchorCreator({
    parent: footerCreator.getElement(),
    href: "https://github.com/Atikin132",
    target: "_blank",
  }).getElement();
  githubLink.textContent = "Atikin132";

  return footerCreator.getElement();
}
