import { FileModel } from "../model/file.model";
import { FolderModel } from "../model/folder.model"
import { FileExtensionsType } from "../types/file-extensions.types";
import { stringsIsNullOrBlank } from "../utilities/_strings";

export default class DocumentService {
    private readonly _KEY = "document-service";

    public seedDataIfNotExists(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const existingJsonStr = localStorage.getItem(this._KEY);
                if (stringsIsNullOrBlank(existingJsonStr)) {
                    const seedJsonStr = JSON.stringify(seedFolder);
                    localStorage.setItem(this._KEY, seedJsonStr);
                } else {
                    console.log("Did not seed data. There is an existing record.")
                }
                resolve();
            } catch (err) {
                console.error(err);
                reject("There's an error while seeding data");
            }
        })
    }

    public getRootFolder(): Promise<FolderModel> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
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
            }, 2000);
        });
    }

    public saveRootFolder(folder: FolderModel): Promise<void> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const jsonStr = JSON.stringify(folder);
                    localStorage.setItem(this._KEY, jsonStr);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, 2000);
        })
    }
}


/**
 * Initial data
 */
const seedFolder: FolderModel = {
    id: crypto.randomUUID(),
    name: "Documents",
    modified: new Date("2026-01-01"),
    modifiedBy: "Megan Bowen",
    files: [
        {
            id: crypto.randomUUID(),
            name: "CoasterAndBargelLoading",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "docx"
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx"
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices2016",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx"
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices2017",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx"
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

    return {
        id,
        name,
        modified,
        modifiedBy,
        extension,
    }
}