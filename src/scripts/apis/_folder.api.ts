import { fetchClient } from "./openapi/fetch-client";
import { FolderModel } from "../models/_folder.model";

export class FolderApi {
    public static async getById(id: string): Promise<FolderModel | undefined> {
        const response = await fetchClient.GET("/folders/{folderId}", {
            params: {
                path: {
                    folderId: id,
                }
            }
        });

        if (response.error) {
            console.error("Failed to get folder by id:", response.error);
            return;
        }

        if (response.data) {
            const data = response.data;
            return new FolderModel(
                data.id ?? "",
                data.name ?? "",
                data.path ?? "",
                data.createdAt ?? "",
                data.createdByName ?? "",
                data.updatedAt ?? "",
                data.updatedByName ?? "",
            );
        }
    }

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

    public static async updateName({
        id,
        name,
    }: {
        id: string;
        name: string;
    }) {
        const response = await fetchClient.PATCH("/folders-name", {
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

    public static async download(folderId: string) {

    }
}