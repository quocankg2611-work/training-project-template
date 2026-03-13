import { FileService } from "../services/_file.service";
import { FolderService } from "../services/_folder.service";

export default async function seedDataIfNotExist() {
    if (localStorage.length === 0) {
        await FolderService.seedRootFolder();

        await FolderService.createFolder({
            name: "CAS",
            containingPath: "",
            modifiedBy: "Megan Bowen",
            modified: new Date("2025-04-30").toISOString(),
        });

        await FileService.createFile({
            name: "CoasterAndBargelLoading",
            containingPath: "",
            content: "",
            fileType: "word",
            modifiedBy: "Administrator MOD",
            modified: new Date().toISOString(),
        });

        await FileService.createFile({
            name: "RevenueByServices",
            containingPath: "",
            content: "",
            fileType: "excel",
            modifiedBy: "Administrator MOD",
            modified: new Date().toISOString(),
        });

        await FileService.createFile({
            name: "RevenueByServices2016",
            containingPath: "",
            content: "",
            fileType: "excel",
            modifiedBy: "Administrator MOD",
            modified: new Date().toISOString(),
        });

        await FileService.createFile({
            name: "RevenueByServices2017",
            containingPath: "",
            content: "",
            fileType: "excel",
            modifiedBy: "Administrator MOD",
            modified: new Date().toISOString(),
        });
    }
}