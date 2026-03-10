import { FileModel } from "../../model/file.model";
import { FolderModel } from "../../model/folder.model";
import { FileExtensionsType } from "../../types/file-extensions.types";
import formatTimeAgo from "../../utilities/_format-strings";

type PossibleIconNames = "folder" | "excel" | "word";

const FileExtensionToIconName = new Map<FileExtensionsType, PossibleIconNames>([
    ["xlsx", "excel"],
    ["docx", "word"]
]);

export type DocumentView = {
    id: string;
    name: string;
    modified: Date;
    modifiedStr: string;
    modifiedBy: string;
    iconName: PossibleIconNames;
}

export function documentViewFromFileModel(file: FileModel): DocumentView {
    const iconName = FileExtensionToIconName.get(file.extension);
    return {
        ...file,
        modifiedStr: formatTimeAgo(file.modified),
        iconName,
    };
}

export function documentViewFromFolderModel(folder: FolderModel): DocumentView {
    return {
        ...folder,
        modifiedStr: formatTimeAgo(folder.modified),
        iconName: "folder",
    };
}
