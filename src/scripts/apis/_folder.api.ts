import { fetchClient } from "./openapi/fetch-client";

export class FolderApi {
    public static async createFolder({
        name,
        parentFolderId
    }: {
        name: string;
        parentFolderId?: string;
    }): Promise<void> {
        const response = await fetchClient.POST("/folders", {
            body: {
                name: name,
                parentFolderId: parentFolderId
            }
        });
        if (response.error) {
            console.error("Failed to create folder:", response.error);
        }
    }
}