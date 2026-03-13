import { localStorageKey, PathModel } from "./__common.service";
import { FileService } from "./_file.service";

type FolderModel = {
    id: string,
    name: string,
    modified: string,
    modifiedBy: string,
    documentType: "file" | "folder",
    containingPath: string,
}

export type CreateFolderRequest = {
    name: string;
    containingPath: string;
    modifiedBy: string;
    modified?: string;
}

export type UpdateFolderRequest = {
    id: string;
    name: string;
}

export class FolderService {
    /**
     * Mandatory seed for root folder for the system to run well and logically
     */
    public static async seedRootFolder() {
        const rootPathKey = localStorageKey.buildFolderPathKey([]);
        localStorage.setItem(rootPathKey, JSON.stringify({
            id: crypto.randomUUID(),
            subDocumentIdKeys: []
        }));
        const rootFolderIdKey = localStorageKey.buildFolderIdKey("root");
        localStorage.setItem(rootFolderIdKey, JSON.stringify({
            id: "root",
            name: "Root",
            containingPath: "",
            modifiedBy: "System",
            modified: new Date().toISOString(),
            documentType: "folder",
        } as FolderModel));
    }

    public static async createFolder(model: CreateFolderRequest) {
        const folderId = crypto.randomUUID();
        const folderIdKey = localStorageKey.buildFolderIdKey(folderId);

        // Change the path model of parent folder to include the new folder (if any)
        const parentPathArr = model.containingPath.split("/").filter(Boolean);
        const parentPathKey = localStorageKey.buildFolderPathKey(parentPathArr);
        const parentPathItem = localStorage.getItem(parentPathKey);
        if (parentPathItem) {
            const pathModel = JSON.parse(parentPathItem) as PathModel;
            pathModel.subDocumentIdKeys.push(folderIdKey);
            localStorage.setItem(parentPathKey, JSON.stringify(pathModel));
        } else {
            throw new Error("Parent folder not found");
        }

        // Create the path model for the new folder
        const pathArr = [...parentPathArr, model.name];
        const folderPathKey = localStorageKey.buildFolderPathKey(pathArr);
        const newPathModel: PathModel = {
            id: folderId,
            subDocumentIdKeys: []
        };
        localStorage.setItem(folderPathKey, JSON.stringify(newPathModel));

        const newDocumentModel: FolderModel = {
            id: folderId,
            name: model.name,
            containingPath: model.containingPath,
            modifiedBy: model.modifiedBy,
            modified: model.modified || new Date().toISOString(),
            documentType: "folder",
        };
        localStorage.setItem(folderIdKey, JSON.stringify(newDocumentModel));
    }

    public static async updateFolder(request: UpdateFolderRequest) {
        const idKey = localStorageKey.buildFolderIdKey(request.id);
        const model = JSON.parse(localStorage.getItem(idKey)) as FolderModel;
        model.name = request.name;
        localStorage.setItem(idKey, JSON.stringify(model));
    }

    /**
     * Delete folder is a bit tricky, we need to delete the folder itself and all the sub documents in the folder recursively.
     * Need to also update the PathModel and the DocumentModel
     * 1. Get DocumentModel by id
     * 2. Get PathModel by DocumentModel.path
     * 3. Loop through all subDocumentIds in PathModel, 
     *      a. if the sub document is a folder, call deleteFolder recursively, 
     *      b. if it's a file, call FileApi.deleteFile
     * 4. Delete the DocumentModel and PathModel of the folder
     * 5. Update the parrent folder's PathModel to remove the deleted folder from subDocumentIds
     */
    public static async deleteFolder(id: string) {
        const idKey = localStorageKey.buildFolderIdKey(id);
        const model = JSON.parse(localStorage.getItem(idKey)) as FolderModel;

        // Get and Delete all sub document until root:
        const pathKey = localStorageKey.buildFolderPathKey(model.containingPath.split("/").filter(Boolean));
        const pathModel = JSON.parse(localStorage.getItem(pathKey) || "") as PathModel;
        for (const id of pathModel.subDocumentIdKeys) {
            const subIdKey = localStorageKey.buildFolderIdKey(id);
            const subModel = JSON.parse(localStorage.getItem(subIdKey) || "") as FolderModel;
            if (subModel.documentType === "folder") {
                await this.deleteFolder(subModel.id);
            } else {
                FileService.deleteFile(subModel.id);
            }
        }

        // Delete the DocumentModel and PathModel of the folder
        localStorage.removeItem(idKey);
        localStorage.removeItem(pathKey);

        // Update the parent folder's PathModel to remove the deleted folder from subDocumentIds
        const parentPathArr = model.containingPath.split("/").filter(Boolean);
        if (parentPathArr.length > 0) {
            const parentPathKey = localStorageKey.buildFolderPathKey(parentPathArr);
            const parentPathItem = localStorage.getItem(parentPathKey);
            if (parentPathItem) {
                const { subDocumentIdKeys: subDocumentIds, id } = JSON.parse(parentPathItem) as PathModel;
                const updatedSubDocumentIds = subDocumentIds.filter((id: string) => id !== model.id);
                const updatedPathModel: PathModel = {
                    id: id,
                    subDocumentIdKeys: updatedSubDocumentIds
                };
                localStorage.setItem(parentPathKey, JSON.stringify(updatedPathModel));
            }
        }
    }
}