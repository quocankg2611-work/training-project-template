import * as msal from "@azure/msal-browser";

let msalInstance: msal.PublicClientApplication | null = null;

export class AuthService {
    public static async initializeAsync(): Promise<msal.PublicClientApplication> {
        if (msalInstance !== null) {
            return msalInstance;
        }
        msalInstance = new msal.PublicClientApplication(msalConfig);
        await msalInstance.initialize();
        return msalInstance;
    }

}

const msalConfig: msal.Configuration = {
    auth: {
        clientId: "b9fff41a-f5dd-4d68-b230-95e45b37ab25",
        authority: "https://login.microsoftonline.com/d09600d6-acac-480e-84d9-7b68daf22e3c",
        redirectUri: "/",
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
