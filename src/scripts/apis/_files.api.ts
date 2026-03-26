import { fetchClient } from "./openapi/fetch-client";

export class FilesApi {
    public static async uploadMany({
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
            formData.append("files", file);
            formData.append(
            "filePaths",
            file.webkitRelativePath || "/"
            );
        }

        const uploadRequest = formData;

        await fetchClient.POST("/files/upload", {
            body: uploadRequest as any, // FormData is not directly supported by our typed fetch client, so we cast it to any
        });
    }

    public static async update({
        id,
        name,
    }: {
        id: string;
        name: string;
    }) {
        const response = await fetchClient.PUT("/files", {
            body: {
                fileId: id,
                newName: name,
            }
        });
        if (response.error) {
            console.error("Failed to update file", response.error);
        }
    }

    public static async delete(fileIds: string[]) {
        const response = await fetchClient.DELETE("/files", {
            body: {
                fileIds,
            }
        });
        if (response.error) {
            console.error("Failed to delete files", response.error);
        }
    }
}