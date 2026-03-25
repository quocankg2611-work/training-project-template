import { fetchClient } from "./openapi/fetch-client";

export class FilesApi {
    public static async uploadFiles(files: File[], basePath: string) {
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
}