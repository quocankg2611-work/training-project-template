const { broadcastResponseToMainFrame } = require("@azure/msal-browser/redirect-bridge");

broadcastResponseToMainFrame().catch((error: any) => {
    console.error("Error broadcasting response:", error);
});