import { localStorageKey, PathModel } from "./__common.service";

export type FileModel = {
    id: string,
    name: string,
    modified: string,
    modifiedBy: string,
    documentType: "file" | "folder",
    containingPath: string,
    fileType: string,
    content: string,
}

export type CreateFileRequest = {
    name: string;
    containingPath: string;
    modified?: string;
    modifiedBy: string;
    fileType: string;
    content: string;
}

export type UpdateFileRequest = {
    id: string;
    name: string;
    fileType: string;
}

export class FileService {
    public static async createFile(model: CreateFileRequest) {
        const fileId = crypto.randomUUID();

        // Retrive the PathModel of the parrent folder and update it to include the new file
        // If no parent folder found => root folder (no need to do anything)
        const parrentPathArr = model.containingPath.split("/").filter(Boolean);
        const parrentPathKey = localStorageKey.buildFolderPathKey(parrentPathArr);
        const parrentPathItem = localStorage.getItem(parrentPathKey);
        if (parrentPathItem) {
            const parentPathModel = JSON.parse(parrentPathItem) as PathModel;
            parentPathModel.subDocumentIdKeys.push(localStorageKey.buildFileIdKey(fileId));
            localStorage.setItem(parrentPathKey, JSON.stringify(parentPathModel));
        } else {
            throw new Error("Parrent folder not found");
        }

        // Create the document model for the new file
        const idKey = localStorageKey.buildFileIdKey(fileId);
        const newFileModel: FileModel = {
            id: fileId,
            name: model.name,
            content: model.content,
            fileType: model.fileType,
            modifiedBy: model.modifiedBy,
            containingPath: model.containingPath,
            documentType: "file",
            modified: new Date().toISOString(),
        };
        localStorage.setItem(idKey, JSON.stringify(newFileModel));
    }

    public static async updateFile(model: UpdateFileRequest) {
        const idKey = localStorageKey.buildFileIdKey(model.id);
        const item = localStorage.getItem(idKey);
        if (!item) {
            throw new Error("File not found");
        }
        const fileModel = JSON.parse(item) as FileModel;
        fileModel.name = model.name;
        fileModel.fileType = model.fileType;
        fileModel.modified = new Date().toISOString();
        localStorage.setItem(idKey, JSON.stringify(fileModel));
    }

    static async deleteFile(id: string) {
        const idKey = localStorageKey.buildFileIdKey(id);
        const item = localStorage.getItem(idKey);
        if (!item) {
            throw new Error("File not found");
        }
        const fileModel = JSON.parse(item) as FileModel;

        // Remove the file from the parrent folder's PathModel
        const parrentPathArr = fileModel.containingPath.split("/").filter(Boolean);
        const parrentPathKey = localStorageKey.buildFolderPathKey(parrentPathArr);
        const parrentPathItem = localStorage.getItem(parrentPathKey);
        if (!parrentPathItem) {
            throw new Error("Parrent folder not found");
        }
        const parentPathModel = JSON.parse(parrentPathItem) as PathModel;
        parentPathModel.subDocumentIdKeys = parentPathModel.subDocumentIdKeys.filter((key) => key !== idKey);
        localStorage.setItem(parrentPathKey, JSON.stringify(parentPathModel));

        // Remove the file document model
        localStorage.removeItem(idKey);
    }
}