import sidebarComponent from "../../components/sidebar.component/sidebar.component.js";
import { User } from "../../interfaces/user.interface.js";
import { BasePage } from "../base-page.js";
import "./main.css";

export class Main extends BasePage {
  create(parent: HTMLElement): void {
    parent.append(this.container);
    this.container.classList.add("main-page");
    const users: User[] = [
      { login: "Qqqqqqqqqqqq", isLogined: true },
      { login: "Wwwwwwwwwwww", isLogined: false },
      { login: "Eeeeeeeeeeee", isLogined: true },
      { login: "Rrrrrrrrrrrr", isLogined: false },
      { login: "Tttttttttttt", isLogined: true },
      { login: "Yyyyyyyyyyyy", isLogined: true },
      { login: "Uuuuuuuuuuuu", isLogined: true },
      { login: "Iiiiiiiiiiii", isLogined: false },
      { login: "Oooooooooooo", isLogined: true },
      { login: "Pppppppppppp", isLogined: false },
      { login: "Aaaaaaaaaaaa", isLogined: false },
      { login: "Ssssssssssss", isLogined: true },
      { login: "Ffffffffffff", isLogined: false },
      { login: "Gggggggggggg", isLogined: false },
      { login: "Hhhhhhhhhhhh", isLogined: false },
      { login: "Jjjjjjjjjjjj", isLogined: true },
      { login: "Kkkkkkkkkkkk", isLogined: false },
      { login: "Llllllllllll", isLogined: true },
      { login: "Zzzzzzzzzzzz", isLogined: false },
      { login: "Xxxxxxxxxxxx", isLogined: true },
      { login: "Cccccccccccc", isLogined: true },
      { login: "Vvvvvvvvvvvv", isLogined: false },
      { login: "Bbbbbbbbbbbb", isLogined: true },
      { login: "Nnnnnnnnnnnn", isLogined: false },
      { login: "Mmmmmmmmmmmm", isLogined: false },
    ];
    this.container.append(sidebarComponent(users));
  }
}
