import { ModalBase } from "./base/_modal.base";

export class DeleteDocumentModal extends ModalBase {
    private readonly subtitleElId: string;
    private readonly messageElId: string;
    private currentDocumentIds: string[] = [];

    constructor(
        onDelete: (documentIds: string[]) => void
    ) {
        super(
            {
                modalType: "deleteDocument",
                onModalConfirmed: () => {
                    onDelete(this.currentDocumentIds);
                    this.hide();
                },
                onModalShow: () => {
                }
            },
            "Delete Document",
            "This action cannot be undone.",
            "Delete"
        );
        this.subtitleElId = `${this.bodyId}--subtitle`;
        this.messageElId = `${this.bodyId}--message`;
        const bodyHtml = `
            <p id="${this.subtitleElId}" class="mb-1 fw-semibold"></p>
            <p id="${this.messageElId}" class="mb-0 text-muted small"></p>
        `;
        const body = document.getElementById(this.bodyId);
        body.innerHTML = bodyHtml;
    }

    public showWithData(documentId: string, documentName: string, documentType: "folder" | "file"): void {
        this.currentDocumentIds = [documentId];

        const subtitleEl = document.getElementById(this.subtitleElId)!;
        const messageEl = document.getElementById(this.messageElId)!;

        subtitleEl.textContent = `Are you sure you want to delete "${documentName}"?`;
        messageEl.textContent = documentType === "folder"
            ? "This folder and all its contents will be permanently removed."
            : "This file will be permanently removed.";

        this.show();
    }

    public showWithDocuments(documents: Array<{ id: string; name: string; documentType: "folder" | "file" }>): void {
        this.currentDocumentIds = documents.map((document) => document.id);

        const subtitleEl = document.getElementById(this.subtitleElId)!;
        const messageEl = document.getElementById(this.messageElId)!;

        const folderCount = documents.filter((document) => document.documentType === "folder").length;
        const fileCount = documents.length - folderCount;

        subtitleEl.textContent = `Are you sure you want to delete ${documents.length} selected items?`;
        messageEl.textContent = `This will permanently remove ${folderCount} folder(s) and ${fileCount} file(s).`;

        this.show();
    }
}
