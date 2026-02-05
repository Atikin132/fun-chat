import ElementCreator from "../../utils/element-creator.js";
import LabelCreator from "../../utils/label/label-creator.js";
import InputCreator from "../../utils/input/input-creator.js";
import "./login-form.component.css";
import ButtonCreator from "../../utils/button/button-creator.js";

const LOGIN_MAX_SIZE = "12";
const LOGIN_MIN_SIZE = 4;
const PASSWORD_MIN_SIZE = 6;

const validateInput = (inputElement: HTMLInputElement, min: number) => {
  const value = inputElement.value.trim();
  inputElement.classList.remove("invalid");

  if (value.length < min) {
    inputElement.setCustomValidity(`Minimum ${min} characters`);
    inputElement.classList.add("invalid");
    return false;
  }

  if (inputElement.name === "password" && !/\p{Lu}/u.test(value)) {
    inputElement.setCustomValidity(
      "Password must contain at least one capital letter",
    );
    inputElement.classList.add("invalid");
    return false;
  }

  inputElement.setCustomValidity("");
  return true;
};

export default function loginFormComponent(
  login: () => Promise<void>,
): HTMLElement {
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
  loginInput.name = "login";
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
  passwordInput.name = "password";
  passwordInput.type = "password";
  passwordInput.setAttribute("required", "true");
  passwordInput.autocomplete = "off";

  const loginButton = new ButtonCreator({
    text: "Login",
    classes: ["login-form__login-button", "no-active", "button"],
    parent: loginForm,
  }).getElement();
  loginButton.disabled = true;

  const submitLogin = () => {
    void login();
    loginInput.value = "";
    passwordInput.value = "";
    loginButton.disabled = true;
    loginButton.classList.add("no-active");
  };

  loginButton.addEventListener("click", submitLogin);

  loginForm.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key !== "Enter") return;
    if (loginButton.disabled) return;

    event.preventDefault();
    submitLogin();
  });

  const aboutButton = new ButtonCreator({
    classes: ["login-form__about-button", "button"],
    parent: loginForm,
  }).getElement();
  aboutButton.dataset.route = "/about";

  const handleInput = (inputEl: HTMLInputElement, min: number) => {
    inputEl.value = inputEl.value.replaceAll(/\s/g, "");
    validateInput(inputEl, min);
    inputEl.reportValidity();
    const isLoginAndPasswordValid =
      loginInput.checkValidity() && passwordInput.checkValidity();

    loginButton.disabled = !isLoginAndPasswordValid;
    loginButton.classList.toggle("no-active", !isLoginAndPasswordValid);
  };

  loginInput.addEventListener("input", () =>
    handleInput(loginInput, LOGIN_MIN_SIZE),
  );

  passwordInput.addEventListener("input", () =>
    handleInput(passwordInput, PASSWORD_MIN_SIZE),
  );

  return loginForm;
}
