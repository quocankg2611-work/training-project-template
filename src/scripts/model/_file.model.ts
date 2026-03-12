import { DocumentModel } from "./_document.model";

export type FileModel = DocumentModel & {
    extension: string; // Allow string for temporary state before validation
    content: string;
}
