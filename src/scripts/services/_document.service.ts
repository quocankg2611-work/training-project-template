import { FileModel } from "../model/_file.model";
import { FolderModel } from "../model/_folder.model"
import { FileExtensionsType } from "../types/_file-extensions.types";
import { requireArray, requireString } from "../utilities/_require";
import { stringsIsNullOrBlank } from "../utilities/_strings";

const DELAY_TIME = 500;

export default class DocumentService {
    private readonly _repository: DocumentRepository;
    private _rootFolder: FolderModel | null;
    private _folderStack: FolderModel[] = [];

    constructor() {
        this._repository = new DocumentRepository();
    }

    private getRootFolderLoaded(): FolderModel {
        if (this._rootFolder === null) {
            throw new Error("Root folder is not loaded yet.");
        }
        return this._rootFolder;
    }

    public loadRootFolder(): Promise<void> {
        return new Promise((resolve, reject) => {
            const loaedResult = this._repository.getRootFolder();
            loaedResult.then(folder => {
                this._rootFolder = folder;
                this._folderStack = [folder];
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    public saveRootFolder(): void {
        this._repository.saveRootFolder(this._rootFolder);
    }

    public getCurrentFolder(): Promise<FolderModel> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                resolve(currentFolder);
            }, DELAY_TIME);
        });
    }

    public getFolderStack(): Promise<FolderModel[]> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                resolve(this._folderStack);
            }, DELAY_TIME);
        });
    }

    public navigateToFolder(folderId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                const targetFolder = currentFolder.subFolders.find(f => f.id === folderId);
                if (targetFolder) {
                    this._folderStack.push(targetFolder);
                    resolve();
                } else {
                    reject("Folder not found.");
                }
            }, DELAY_TIME);
        });
    }

    public navigateBackToFolder(folderId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const index = this._folderStack.findIndex(f => f.id === folderId);
                if (index !== -1) {
                    this._folderStack.splice(index + 1);
                    resolve();
                } else {
                    reject("Folder not found in stack.");
                }
            }, DELAY_TIME);
        });
    }

    public addFolder(folderName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                const newFolder: FolderModel = {
                    id: crypto.randomUUID(),
                    name: folderName,
                    modified: new Date(),
                    modifiedBy: "Current User",
                    files: [],
                    subFolders: []
                };
                currentFolder.subFolders.push(newFolder);

                resolve();
            }, DELAY_TIME);
        });
    }

    public addFile(fileName: string, extension: FileExtensionsType, content: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                const newFile: FileModel = {
                    id: crypto.randomUUID(),
                    name: fileName,
                    modified: new Date(),
                    modifiedBy: "Current User",
                    extension,
                    content,
                };
                currentFolder.files.push(newFile);
                resolve();
            }, DELAY_TIME);
        });
    }

    public updateFile(fileId: string, fileName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                const file = currentFolder.files.find(f => f.id === fileId);
                if (file) {
                    file.name = fileName;
                    file.modified = new Date();
                    file.modifiedBy = "Current User";
                    resolve();
                } else {
                    reject("File not found.");
                }
            }, DELAY_TIME);
        });
    }

    public updateFolder(folderId: string, folderName: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                const folder = currentFolder.subFolders.find(f => f.id === folderId);
                if (folder) {
                    folder.name = folderName;
                    folder.modified = new Date();
                    folder.modifiedBy = "Current User";
                    resolve();
                } else {
                    reject("Folder not found.");
                }
            }, DELAY_TIME);
        });
    }

    public deleteFolder(folderId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                currentFolder.subFolders = currentFolder.subFolders.filter(f => f.id !== folderId);
                resolve();
            }, DELAY_TIME);
        });
    }

    public deleteFile(fileId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this._folderStack.length === 0) {
                    reject("No folder in stack.");
                    return;
                }
                const currentFolder = this._folderStack[this._folderStack.length - 1];
                currentFolder.files = currentFolder.files.filter(f => f.id !== fileId);
                resolve();
            }, DELAY_TIME);
        });
    }
}

/**
 * Will seed data upon initialization.
 */
class DocumentRepository {
    private readonly _KEY = "document-service";
    private _loaded: boolean = false;

    constructor() {
        this.seedDataIfNotExists().then(() => {
            this._loaded = true
        });
    }

    private seedDataIfNotExists(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const existingJsonStr = localStorage.getItem(this._KEY);
                if (stringsIsNullOrBlank(existingJsonStr)) {
                    const seedJsonStr = JSON.stringify(seedFolderData);
                    localStorage.setItem(this._KEY, seedJsonStr);
                } else {
                    console.log("Did not seed data. There is an existing record.")
                }
                resolve();
            } catch (err) {
                console.error(err);
                reject("There's an error while seeding data");
            }
        });
    }

    public getRootFolder(): Promise<FolderModel> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    if (this._loaded === false) {
                        reject("Data is not loaded yet.");
                        return;
                    }
                    const jsonStr = localStorage.getItem(this._KEY);
                    if (stringsIsNullOrBlank(jsonStr) === true) {
                        reject("Not found.")
                    } else {
                        const json = JSON.parse(jsonStr);
                        const folder = folderParser(json);
                        resolve(folder);
                    }
                } catch (error) {
                    reject(error);
                }
            }, DELAY_TIME);
        });
    }

    public saveRootFolder(folder: FolderModel): void {
        const jsonStr = JSON.stringify(folder);
        localStorage.setItem(this._KEY, jsonStr);
    }
}

/**
 * Initial data
 */
const seedFolderData: FolderModel = {
    id: crypto.randomUUID(),
    name: "Home",
    modified: new Date("2026-01-01"),
    modifiedBy: "Megan Bowen",
    files: [
        {
            id: crypto.randomUUID(),
            name: "CoasterAndBargelLoading",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "docx",
            content: ""
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx",
            content: ""
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices2016",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx",
            content: ""
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices2017",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx",
            content: ""
        }
    ],
    subFolders: [
        {
            id: crypto.randomUUID(),
            name: "CAS",
            modified: new Date("2025-04-30"),
            modifiedBy: "Megan Bowen",
            files: [],
            subFolders: []
        }
    ]
};

/**
 * Parsers
 */

function folderParser(obj: any): FolderModel {
    const id = requireString(obj, "id");
    const name = requireString(obj, "name");
    const modified = new Date(requireString(obj, "modified"));
    const modifiedBy = requireString(obj, "modifiedBy");

    const files = requireArray(obj, "files").map(fileParser);
    const subFolders = requireArray(obj, "subFolders").map(folderParser);

    return {
        id,
        name,
        modified,
        modifiedBy,
        files,
        subFolders,
    }
}

function fileParser(obj: any): FileModel {
    const id = requireString(obj, "id");
    const name = requireString(obj, "name");
    const modified = new Date(requireString(obj, "modified"));
    const modifiedBy = requireString(obj, "modifiedBy");
    const extension = requireString(obj, "extension") as FileExtensionsType ?? "docx";
    const content = obj.content ?? "";

    return {
        id,
        name,
        modified,
        modifiedBy,
        extension,
        content,
    }
}