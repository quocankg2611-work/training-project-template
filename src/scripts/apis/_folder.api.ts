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

    public static async upload({
        files,
        basePath,
        // TODO: implement upload progress and completion handlers
        onUploadProgress,
        onUploadComplete,
    }: {
        files: File[];
        basePath: string;
        onUploadProgress?: (index: number, progress: number) => void;
        onUploadComplete?: (index: number, isSuccess: boolean) => void;
    }) {
        const formData = new FormData();
        formData.append("basePath", basePath);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const path = file.webkitRelativePath.trim() !== ""
                ? "/" + file.webkitRelativePath.split("/").slice(0, -1).join("/") // Remove the file name from the path, we only want the folder structure, and ensure it starts with a "/"
                : "/";
            formData.append("files", file);
            formData.append("filePaths", path);
        }

        const uploadRequest = formData;

        await fetchClient.POST("/folders/upload", {
            body: uploadRequest as any, // FormData is not directly supported by our typed fetch client, so we cast it to any
        });
    }
}