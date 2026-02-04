import App from "./app/app.js";
import { Router } from "./app/router.js";
import { authController } from "./controllers/auth.controller.js";
import { About } from "./pages/about/about.js";
import { Login } from "./pages/login/login.js";
import { Main } from "./pages/main/main.js";

const app = new App(document.body);

authController.restore();

app.init();
app.register("login", new Login());
app.register("main", new Main());
app.register("about", new About());

const router = new Router(app);
router.init();
