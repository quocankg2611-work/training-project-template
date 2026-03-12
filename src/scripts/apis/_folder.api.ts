import { localStorageKey, PathModel } from "./__common.api";
import { FileApi } from "./_file.api";

type FolderModel = {
    id: string,
    name: string,
    modified: string,
    modifiedBy: string,
    documentType: "file" | "folder",
    path: string,
}

export type CreateFolderRequest = {
    name: string;
    path: string;
    modifiedBy: string;
}

export type UpdateFolderRequest = {
    id: string;
    name: string;
}

export class FolderApi {
    public static async createFolder(model: CreateFolderRequest) {
        const pathArr = model.path.split("/").filter(Boolean);
        const parrentPathArr = pathArr.slice(0, -1);
        // Change the path model of parrent folder to include the new folder
        if (parrentPathArr.length > 0) {
            const parrentPathKey = localStorageKey.buildFolderPathKey(parrentPathArr);
            const parrentPathItem = localStorage.getItem(parrentPathKey);
            if (!parrentPathItem) {
                throw new Error("Parrent folder not found");
            }
            const { subDocumentIdKeys: subDocumentIds } = JSON.parse(parrentPathItem) as PathModel;
            subDocumentIds.push(model.path);
            localStorage.setItem(parrentPathKey, JSON.stringify({
                id: crypto.randomUUID(),
                subDocumentIds
            }));
        }

        // Create the path model for the new folder
        const pathKey = localStorageKey.buildFolderPathKey(pathArr);
        const newPathModel: PathModel = {
            id: crypto.randomUUID(),
            subDocumentIdKeys: []
        };
        localStorage.setItem(pathKey, JSON.stringify(newPathModel));

        // Create the document model for the new folder
        const id = crypto.randomUUID();

        const idKey = localStorageKey.buildFolderIdKey(id);
        const newDocumentModel: FolderModel = {
            id: id,
            name: model.name,
            path: model.path,
            modifiedBy: model.modifiedBy,
            modified: new Date().toISOString(),
            documentType: "folder",
        };
        localStorage.setItem(idKey, JSON.stringify(newDocumentModel));
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
        const pathKey = localStorageKey.buildFolderPathKey(model.path.split("/").filter(Boolean));
        const pathModel = JSON.parse(localStorage.getItem(pathKey) || "") as PathModel;
        for (const id of pathModel.subDocumentIdKeys) {
            const subIdKey = localStorageKey.buildFolderIdKey(id);
            const subModel = JSON.parse(localStorage.getItem(subIdKey) || "") as FolderModel;
            if (subModel.documentType === "folder") {
                await this.deleteFolder(subModel.id);
            } else {
                FileApi.deleteFile(subModel.id);
            }
        }

        // Delete the DocumentModel and PathModel of the folder
        localStorage.removeItem(idKey);
        localStorage.removeItem(pathKey);

        // Update the parent folder's PathModel to remove the deleted folder from subDocumentIds
        const pathArr = model.path.split("/").filter(Boolean);
        const parentPathArr = pathArr.slice(0, -1);
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