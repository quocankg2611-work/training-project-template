
import formatTimeAgo from "../utilities/_format-strings";
import { localStorageKey, PathModel } from "./__common.api";

export type DocumentResponse = {
    id: string,
    name: string,
    path: string,
    modifiedBy: string,
    documentType: "file" | "folder",
    fileType: string | null,
    modified: string,
    modifiedTimeAgo: string,
    modifiedMs: number,
}

/**
 * Common operations between files and folders
 */

export class DocumentApi {
    public static async getDocumentsByPath(pathArr: string[]): Promise<DocumentResponse[]> {
        const pathKey = localStorageKey.buildFolderPathKey(pathArr);
        const item = localStorage.getItem(pathKey);
        if (!item) {
            throw new Error("Folder not found");
        }
        const { subDocumentIdKeys: subDocumentIds } = JSON.parse(item) as PathModel;
        const documents: DocumentResponse[] = [];
        for (const id of subDocumentIds) {
            if (id.startsWith("folder")) {
                const folder = await this.getFolderFromKey(id);
                documents.push(folder);
            } else if (id.startsWith("file")) {
                const file = await this.getFileFromKey(id);
                documents.push(file);
            }
        }
        return documents;
    }

    private static async getFolderFromKey(idKey: string): Promise<DocumentResponse> {
        const item = localStorage.getItem(idKey);
        if (!item) {
            throw new Error("Folder not found");
        }
        const json = JSON.parse(item);
        return {
            id: json.id,
            name: json.name,
            path: json.path,
            modifiedBy: json.modifiedBy,
            modified: json.modified,
            documentType: "folder",
            fileType: null,
            modifiedTimeAgo: formatTimeAgo(json.modified),
            modifiedMs: new Date(json.modified).getTime(),
        };
    }

    private static async getFileFromKey(idKey: string): Promise<DocumentResponse> {
        const item = localStorage.getItem(idKey);
        if (!item) {
            throw new Error("File not found");
        }
        const json = JSON.parse(item);
        return {
            id: json.id,
            name: json.name,
            path: json.path,
            modifiedBy: json.modifiedBy,
            documentType: "file",
            fileType: json.fileType,
            modified: json.modified,
            modifiedMs: new Date(json.modified).getTime(),
            modifiedTimeAgo: formatTimeAgo(json.modified),
        };
    }
}