import { FileExtensionsType } from "../types/_file-extensions.types";
import { DocumentModel } from "./_document.model";

export type FileModel = DocumentModel & {
    extension: FileExtensionsType;
}
