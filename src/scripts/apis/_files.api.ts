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
        const fileRequests: {
            filePath: string;
            fileContentBinary: string;
        }[] = [];
        files.forEach(async (file) => {
            const filePath = file.webkitRelativePath || "/";
            const reader = new FileReader();
            const fileContentBinary = await new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    const content = reader.result as string;
                    resolve(content);
                };
                reader.onerror = () => {
                    reject(new Error(`Failed to read file: ${file.name}`));
                };
                reader.readAsDataURL(file);
            });

            fileRequests.push({
                filePath,
                fileContentBinary,
            });
        });

        const uploadRequest = {
            basePath,
            files: fileRequests.map(fr => fr.fileContentBinary),
            filePaths: fileRequests.map(fr => fr.filePath),
        };

        await fetchClient.POST("/files/upload", {
            body: uploadRequest,
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