import * as msal from "@azure/msal-browser";

let msalInstance: msal.PublicClientApplication | null = null;
const API_SCOPES = [
    "api://b9fff41a-f5dd-4d68-b230-95e45b37ab25/access_as_user",
];
const LOGIN_REDIRECT_URI = "/redirect.html";

export class AuthService {
    private static async initializeAsync(): Promise<msal.PublicClientApplication> {
        if (msalInstance !== null) {
            return msalInstance;
        }
        msalInstance = new msal.PublicClientApplication(msalConfig);
        await msalInstance.initialize();
        return msalInstance;
    }

    public static async restoreSessionAsync(): Promise<boolean> {
        const instance = await this.initializeAsync();

        const redirectResponse = await instance.handleRedirectPromise().catch((_: unknown): null => null);
        if (redirectResponse?.account) {
            instance.setActiveAccount(redirectResponse.account);
        }

        const activeAccount = instance.getActiveAccount();
        if (activeAccount) {
            return true;
        }

        const [firstAccount] = instance.getAllAccounts();
        if (firstAccount) {
            instance.setActiveAccount(firstAccount);
            return true;
        }

        return false;
    }

    public static async loginAsync(): Promise<void> {
        const instance = await this.initializeAsync();
        const loginResponse = await instance.loginPopup({
            scopes: API_SCOPES,
            redirectUri: LOGIN_REDIRECT_URI,
        });

        if (loginResponse.account) {
            instance.setActiveAccount(loginResponse.account);
        }
    }

    public static async logoutAsync(): Promise<void> {
        const instance = await this.initializeAsync();
        const activeAccount = instance.getActiveAccount() || instance.getAllAccounts()[0];
        await instance.logoutRedirect({
            account: activeAccount,
            postLogoutRedirectUri: "/",
        });
    }

    public static async getAccessTokenAsync(scopes: string[] = API_SCOPES): Promise<string | null> {
        const instance = await this.initializeAsync();
        let account = instance.getActiveAccount();

        if (!account) {
            const [firstAccount] = instance.getAllAccounts();
            if (firstAccount) {
                account = firstAccount;
                instance.setActiveAccount(firstAccount);
            }
        }

        if (!account) {
            return null;
        }

        try {
            const tokenResponse = await instance.acquireTokenSilent({
                scopes,
                account,
            });
            return tokenResponse.accessToken;
        } catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                return null;
            }
            throw error;
        }
    }

}

const msalConfig: msal.Configuration = {
    auth: {
        clientId: "b9fff41a-f5dd-4d68-b230-95e45b37ab25",
        authority: "https://login.microsoftonline.com/d09600d6-acac-480e-84d9-7b68daf22e3c",
        redirectUri: "/",
        onRedirectNavigate(url) {
            // Prevent navigation after redirect to preserve the state of the single page application
            return false;
        },
    },
    cache: {
        cacheLocation: "sessionStorage",
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case msal.LogLevel.Error:
                        console.error(message);
                        return;
                    case msal.LogLevel.Info:
                        console.info(message);
                        return;
                    case msal.LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case msal.LogLevel.Warning:
                        console.warn(message);
                        return;
                }
            },
        },
    }
};
