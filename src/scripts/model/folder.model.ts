import { DocumentModel } from "./document.model";
import { FileModel } from "./file.model";

export type FolderModel = DocumentModel & {
    files: FileModel[];
    subFolders: FolderModel[];
}
