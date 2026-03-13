export const localStorageKey = {
    FOLDER: "folder",
    FILE: "file",
    PATH: "path",
    ID: "id",

    buildFolderPathKey(pathArr: string[]) {
        return `${this.FOLDER}:path:${pathArr.join("/")}`;
    },

    buildFolderIdKey(id: string) {
        return `${this.FOLDER}:id:${id}`;
    },

    buildFileIdKey(id: string) {
        return `${this.FILE}:id:${id}`;
    },
} as const;


export type PathModel = {
    /**
     * The folder id that the path is representing
     */
    id: string;

    /**
     * The list of sub document id keys that are in the folder represented by the path
     * DocumentId is in the form of: "folder:id:{folderId}" or "file:id:{fileId}"
     * To check if the ID is for a file or folder, you can check the prefix of the ID. If it starts with "folder", it's a folder. If it starts with "file", it's a file.
     * NOTE: They are not ID !!!!!!!!!!
     */
    subDocumentIdKeys: string[];
}

// const seedFolderData: FolderModel = {
//     id: crypto.randomUUID(),
//     name: "Home",
//     modified: new Date("2026-01-01").toISOString(),
//     modifiedBy: "Megan Bowen",
//     files: [
//         {
//             id: crypto.randomUUID(),
//             name: "CoasterAndBargelLoading",
//             modified: new Date().toISOString(),
//             modifiedBy: "Administrator MOD",
//             extension: "docx",
//             content: ""
//         },
//         {
//             id: crypto.randomUUID(),
//             name: "RevenueByServices",
//             modified: new Date().toISOString(),
//             modifiedBy: "Administrator MOD",
//             extension: "xlsx",
//             content: ""
//         },
//         {
//             id: crypto.randomUUID(),
//             name: "RevenueByServices2016",
//             modified: new Date().toISOString(),
//             modifiedBy: "Administrator MOD",
//             extension: "xlsx",
//             content: ""
//         },
//         {
//             id: crypto.randomUUID(),
//             name: "RevenueByServices2017",
//             modified: new Date().toISOString(),
//             modifiedBy: "Administrator MOD",
//             extension: "xlsx",
//             content: ""
//         }
//     ],
//     subFolders: [
//         {
//             id: crypto.randomUUID(),
//             name: "CAS",
//             modified: new Date("2025-04-30").toISOString(),
//             modifiedBy: "Megan Bowen",
//             files: [],
//             subFolders: []
//         }
//     ]
// };
