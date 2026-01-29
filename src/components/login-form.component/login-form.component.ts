import ElementCreator from "../../utils/element-creator.js";
import LabelCreator from "../../utils/label/label-creator.js";
import InputCreator from "../../utils/input/input-creator.js";
import "./login-form.component.css";
import ButtonCreator from "../../utils/button/button-creator.js";

const LOGIN_MAX_SIZE = "12";

export default function loginFormComponent(): HTMLElement {
  const loginForm = new ElementCreator({
    classes: ["login-form"],
  }).getElement();

  const inputFields = new ElementCreator({
    parent: loginForm,
    classes: ["login-form__input-fields"],
  }).getElement();

  const loginGroup = new ElementCreator({
    parent: inputFields,
    classes: ["login-group"],
  }).getElement();

  const loginLabel = new LabelCreator({
    text: "Name",
    classes: ["login-form__login-input-label"],
    parent: loginGroup,
  }).getElement();
  loginLabel.setAttribute("for", "login");

  const loginInput = new InputCreator({
    parent: loginGroup,
    classes: ["login-form__login-input"],
    placeholder: "Enter name",
  }).getElement();
  loginInput.id = "login";
  loginInput.type = "text";
  loginInput.setAttribute("maxlength", LOGIN_MAX_SIZE);
  loginInput.setAttribute("required", "true");
  loginInput.autocomplete = "off";

  const passwordGroup = new ElementCreator({
    parent: inputFields,
    classes: ["password-group"],
  }).getElement();

  const passwordLabel = new LabelCreator({
    text: "Password",
    classes: ["login-form__password-input-label"],
    parent: passwordGroup,
  }).getElement();
  passwordLabel.setAttribute("for", "password");

  const passwordInput = new InputCreator({
    parent: passwordGroup,
    classes: ["login-form__password-input"],
    placeholder: "Enter password",
  }).getElement();
  passwordInput.id = "password";
  passwordInput.type = "password";
  passwordInput.setAttribute("required", "true");
  passwordInput.autocomplete = "off";

  const loginButton = new ButtonCreator({
    text: "Login",
    classes: ["login-form__login-button", "button"],
    parent: loginForm,
  }).getElement();
  loginButton.dataset.route = "/main";

  const aboutButton = new ButtonCreator({
    classes: ["login-form__about-button", "button"],
    parent: loginForm,
  }).getElement();
  aboutButton.dataset.route = "/about";

  return loginForm;
}
