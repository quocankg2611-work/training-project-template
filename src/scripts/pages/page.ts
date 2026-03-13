import { onAppReady } from "../utilities/_events";
import { HomePageController } from "./home/_home-page.controller";

onAppReady(() => bootstrap());

function bootstrap() {
    const homePageController = new HomePageController();

    homePageController.bootstrap();
}

