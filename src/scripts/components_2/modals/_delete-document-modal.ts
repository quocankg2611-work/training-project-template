import { ModalBase } from "./base/_modal.base";

export class DeleteDocumentModal extends ModalBase {
    private readonly subtitleElId: string;
    private readonly messageElId: string;
    private readonly onDelete: (documentId: string, documentType: "folder" | "file") => void;

    private currentDocumentId = "";
    private currentDocumentType: "folder" | "file" = "folder";

    constructor(
        onDelete: (documentId: string, documentType: "folder" | "file") => void
    ) {
        super(
            "Delete Document",
            "This action cannot be undone.",
            "Delete"
        );
        const id = this.getModalId();
        this.subtitleElId = `${id}--subtitle`;
        this.messageElId = `${id}--message`;
        this.onDelete = onDelete;
    }

    protected getModalName(): string {
        return "deleteDocument";
    }

    protected buildBodyHtml(): string {
        return `
            <p id="${this.subtitleElId}" class="mb-1 fw-semibold"></p>
            <p id="${this.messageElId}" class="mb-0 text-muted small"></p>
        `;
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();

        confirmBtn.addEventListener("click", () => {
            this.onDelete(this.currentDocumentId, this.currentDocumentType);
            this.hide();
        });
    }

    public showWithData(documentId: string, documentName: string, documentType: "folder" | "file"): void {
        this.currentDocumentId = documentId;
        this.currentDocumentType = documentType;

        const subtitleEl = document.getElementById(this.subtitleElId)!;
        const messageEl = document.getElementById(this.messageElId)!;

        subtitleEl.textContent = `Are you sure you want to delete "${documentName}"?`;
        messageEl.textContent = documentType === "folder"
            ? "This folder and all its contents will be permanently removed."
            : "This file will be permanently removed.";

        this.show();
    }
}
