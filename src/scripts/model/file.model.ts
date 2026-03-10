import { FileExtensionsType } from "../types/file-extensions.types";
import { DocumentModel } from "./document.model";

export type FileModel = DocumentModel & {
    extension: FileExtensionsType;
}
