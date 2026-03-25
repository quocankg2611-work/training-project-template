import { DocumentModel } from "../models/_document.model";
import { fetchClient } from "./openapi/fetch-client";

export class DocumentsApi {
    public static async getByPath(path: string): Promise<DocumentModel[]> {
        const response = await fetchClient.GET("/documents", {
            params: {
                query: {
                    Path: path
                }
            }
        });
        if (response.data) {
            const documents = response.data.items.map((item) => {
                const modified = new Date(item.updatedAt);
                return new DocumentModel(
                    item.id,
                    item.name,
                    item.path,
                    item.documentType as "file" | "folder" || "file",
                    item.fileType,
                    modified.toISOString(),
                    item.modifiedBy,
                );
            })
            return documents;
        } else {
            console.error("Failed to fetch documents:", response.error);
            return [];
        }
    }
}