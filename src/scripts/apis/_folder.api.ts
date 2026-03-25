import { fetchClient } from "./openapi/fetch-client";

export class FolderApi {
    public static async create({
        name,
        parentFolderId
    }: {
        name: string;
        parentFolderId?: string;
    }) {
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

    public static async update({
        id,
        name,
    }: {
        id: string;
        name: string;
    }) {
        const response = await fetchClient.PUT("/folders", {
            body: {
                folderId: id,
                newName: name
            }
        });
        if (response.error) {
            console.error("Failed to update folder:", response.error);
        }
    }

    public static async delete(folderIds: string[]) {
        const response = await fetchClient.DELETE("/folders", {
            body: {
                folderIds
            }
        });
        if (response.error) {
            console.error("Failed to delete folder:", response.error);
        }
    }
}