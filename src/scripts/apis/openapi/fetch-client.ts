import createClient from "openapi-fetch";
import { paths } from "./types";
import { CONSTANTS } from "../../_constants";
import { AuthService } from "../../services/_auth.service";

export const fetchClient = createClient<paths>({
    baseUrl: CONSTANTS.API_BASE_URL,
});

fetchClient.use({
    onRequest: async ({ request }) => {
        const token = await AuthService.getAccessTokenAsync().catch((_: unknown): null => null);
        if (!token) {
            return request;
        }

        const headers = new Headers(request.headers);
        headers.set("Authorization", `Bearer ${token}`);
        return new Request(request, { headers });
    },
});
