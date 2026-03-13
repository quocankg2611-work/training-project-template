import { onAppReady } from "../utilities/_events";
import seedDataIfNotExist from "../utilities/_seed";
import { HomePageController } from "./home/_home-page.controller";

onAppReady(() => bootstrap());

function bootstrap() {
    seedDataIfNotExist().then(() => {
        const homePageController = new HomePageController();
        homePageController.bootstrap();
    });
}

