import { DocumentModel } from "../../models/_document.model";
import formatTimeAgo from "../../utilities/_format-strings";

export type HomePageCurrentFolder = {
    id?: string;
    path: string;
};

export class HomePageDocumentView {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly modifiedMs: number,
        public readonly modifiedTimeAgo: string,
        public readonly modifiedBy: string,
        public readonly documentType: "folder" | "file",
        public readonly fileType: string | null,
    ) { }

    public static fromDocumentResponse(response: DocumentModel): HomePageDocumentView {
        if (response.documentType === "file") {
            return new HomePageDocumentView(
                response.id,
                response.name,
                new Date(response.modified).getTime(),
                formatTimeAgo(response.modified),
                response.modifiedBy,
                "file",
                response.fileType ?? null,
            );
        } else {
            return new HomePageDocumentView(
                response.id,
                response.name,
                new Date(response.modified).getTime(),
                formatTimeAgo(response.modified),
                response.modifiedBy,
                "folder",
                "folder",
            );
        }
    }
}
