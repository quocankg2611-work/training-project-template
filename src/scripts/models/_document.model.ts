import { EXTENSION_TO_ICON_MAP } from "../_constants";
import formatTimeAgo from "../utilities/_format-strings";

export class DocumentModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly path: string,
        public readonly documentType: "file" | "folder",
        public readonly extension: string | null,
        public readonly modified: string,
        public readonly modifiedBy: string,
        public readonly parentFolderId?: string,
    ) { }

    public get modifiedMs() {
        const modifiedDate = new Date(this.modified);
        const now = new Date();
        return now.getTime() - modifiedDate.getTime();
    }

    public get modifiedTimeAgo() {
        return formatTimeAgo(this.modified);
    }

    public get fileType(): string | null {
        return EXTENSION_TO_ICON_MAP[this.extension ?? ""] ?? "unknown";
    }
}
