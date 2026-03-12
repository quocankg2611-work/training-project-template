import { FileModel } from "../../../model/_file.model";
import { FolderModel } from "../../../model/_folder.model";
import formatTimeAgo from "../../../utilities/_format-strings";

const FileExtensionToIconName = new Map<string, string>([
    ["xlsx", "excel"],
    ["docx", "word"]
]);

export type HomePageDocumentView = {
    id: string;
    name: string;
    modifiedMs: number; // For sorting
    modifiedStr: string;
    modifiedBy: string;
    documentType: "folder" | "file";
    iconName?: string; // Optional, can be derived from documentType and extension
    onDocumentClicked?: () => void;
}

export function documentViewFromFileModel(file: FileModel): HomePageDocumentView {
    const iconName = FileExtensionToIconName.get(file.extension) ?? null;
    return {
        ...file,
        modifiedMs: new Date(file.modified).getTime(),
        modifiedStr: formatTimeAgo(file.modified),
        documentType: "file",
        iconName: iconName
    };
}

export function documentViewFromFolderModel(folder: FolderModel, onFolderClicked: (folder: FolderModel) => void): HomePageDocumentView {
    return {
        ...folder,
        modifiedMs: new Date(folder.modified).getTime(),
        modifiedStr: formatTimeAgo(folder.modified),
        documentType: "folder",
        iconName: "folder",
        onDocumentClicked: () => onFolderClicked(folder)
    };
}
