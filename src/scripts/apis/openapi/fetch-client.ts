import createClient from "openapi-fetch";
import { paths } from "./types";
import { CONSTANTS } from "../../_constants";

export const fetchClient = createClient<paths>({
    baseUrl: CONSTANTS.API_BASE_URL,
});
