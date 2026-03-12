import { localStorageKey, PathModel } from "./__common.api";

export type FileModel = {
    id: string,
    name: string,
    modified: string,
    modifiedBy: string,
    documentType: "file" | "folder",
    path: string,
    extension: string,
    content: string,
}

export type CreateFileRequest = {
    name: string;
    path: string;
    modifiedBy: string;
    extension: string;
    content: string;
}

export type UpdateFileRequest = {
    id: string;
    name: string;
    extension: string;
}

export class FileApi {
    public static async createFile(model: CreateFileRequest) {
        const fileId = crypto.randomUUID();

        // Retrive the PathModel of the parrent folder and update it to include the new file
        const pathArr = model.path.split("/").filter(Boolean);
        const parrentPathArr = pathArr.slice(0, -1);
        const parrentPathKey = localStorageKey.buildFolderPathKey(parrentPathArr);
        const parrentPathItem = localStorage.getItem(parrentPathKey);
        if (!parrentPathItem) {
            throw new Error("Parrent folder not found");
        }
        const parentPathModel = JSON.parse(parrentPathItem) as PathModel;
        parentPathModel.subDocumentIdKeys.push(localStorageKey.buildFileIdKey(fileId));
        localStorage.setItem(parrentPathKey, JSON.stringify(parentPathModel));

        // Create the document model for the new file
        const idKey = localStorageKey.buildFileIdKey(fileId);
        const newFileModel: FileModel = {
            id: fileId,
            name: model.name,
            content: model.content,
            extension: model.extension,
            modifiedBy: model.modifiedBy,
            path: model.path,
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
        fileModel.extension = model.extension;
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
        const pathArr = fileModel.path.split("/").filter(Boolean);
        const parrentPathArr = pathArr.slice(0, -1);
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