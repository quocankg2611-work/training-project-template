/**
 * Sets up the "Delete Document" modal interaction.
 *
 * @param onDelete - Callback invoked with the document id and its type ("folder" or "file").
 *                   Implement the actual deletion logic here.
 * @returns An object with an `open` method to programmatically show the modal
 *          with the document name displayed in the confirmation message.
 */
export default function setupDeleteDocumentModal(
    onDelete: (documentId: string, documentType: "folder" | "file") => void
): { open: (documentId: string, documentName: string, documentType: "folder" | "file") => void } {
    const modalEl = document.getElementById("deleteDocumentModal")!;
    const subtitleEl = document.getElementById("deleteDocumentSubtitle")!;
    const messageEl = document.getElementById("deleteDocumentMessage")!;
    const deleteBtn = document.getElementById("deleteDocumentBtn") as HTMLButtonElement;

    let currentDocumentId = "";
    let currentDocumentType: "folder" | "file" = "folder";

    // Validate and submit
    deleteBtn.addEventListener("click", () => {
        onDelete(currentDocumentId, currentDocumentType);

        const bsModal = (window as any).bootstrap.Modal.getInstance(modalEl);
        bsModal?.hide();
    });

    return {
        open(documentId: string, documentName: string, documentType: "folder" | "file") {
            currentDocumentId = documentId;
            currentDocumentType = documentType;
            subtitleEl.textContent = `Are you sure you want to delete "${documentName}"?`;
            messageEl.textContent = documentType === "folder"
                ? "This folder and all its contents will be permanently removed."
                : "This file will be permanently removed.";
            const bsModal = new (window as any).bootstrap.Modal(modalEl);
            bsModal.show();
        }
    };
}
