/**
 * Sets up the "Update Folder" modal interaction.
 *
 * @param onUpdateFolder - Callback invoked with the folder id and the trimmed new folder name.
 *                         Implement the actual folder update logic here.
 * @returns An object with an `open` method to programmatically show the modal pre-filled
 *          with the current folder name.
 */
export default function setupUpdateFolderModal(
    onUpdateFolder: (folderId: string, folderName: string) => void
): { open: (folderId: string, currentName: string) => void } {
    const modalEl = document.getElementById("updateFolderModal")!;
    const input = document.getElementById("updateFolderName") as HTMLInputElement;
    const errorDiv = document.getElementById("updateFolderNameError")!
    const updateBtn = document.getElementById("updateFolderBtn") as HTMLButtonElement;

    let currentFolderId = "";

    // Reset validation state when modal is opened
    modalEl.addEventListener("show.bs.modal", () => {
        input.classList.remove("is-invalid");
        errorDiv.style.display = "none";
    });

    // Validate and submit
    updateBtn.addEventListener("click", () => {
        const folderName = input.value.trim();

        if (!folderName) {
            input.classList.add("is-invalid");
            errorDiv.style.display = "block";
            return;
        }

        onUpdateFolder(currentFolderId, folderName);

        const bsModal = (window as any).bootstrap.Modal.getInstance(modalEl);
        bsModal?.hide();
    });

    // Clear validation on input
    input.addEventListener("input", () => {
        if (input.value.trim()) {
            input.classList.remove("is-invalid");
            errorDiv.style.display = "none";
        }
    });

    return {
        open(folderId: string, currentName: string) {
            currentFolderId = folderId;
            input.value = currentName;
            const bsModal = new (window as any).bootstrap.Modal(modalEl!);
            bsModal.show();
        }
    };
}
