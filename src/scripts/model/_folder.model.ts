import { DocumentModel } from "./_document.model";
import { FileModel } from "./_file.model";

export type FolderModel = DocumentModel & {
    files: FileModel[];
    subFolders: FolderModel[];
}
