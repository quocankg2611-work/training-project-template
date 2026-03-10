/**
 * Sets up the "Update File" modal interaction.
 *
 * @param onUpdateFile - Callback invoked with the file id and the trimmed new file name.
 *                         Implement the actual file update logic here.
 * @returns An object with an `open` method to programmatically show the modal pre-filled
 *          with the current file name.
 */
export default function setupUpdateFileModal(
    onUpdateFile: (fileId: string, fileName: string) => void
): { open: (fileId: string, currentName: string) => void } {
    const modalEl = document.getElementById("updateFileModal")!;
    const input = document.getElementById("updateFileName") as HTMLInputElement;
    const errorDiv = document.getElementById("updateFileNameError")!
    const updateBtn = document.getElementById("updateFileBtn") as HTMLButtonElement;

    let currentFileId = "";

    // Reset validation state when modal is opened
    modalEl.addEventListener("show.bs.modal", () => {
        input.classList.remove("is-invalid");
        errorDiv.style.display = "none";
    });

    // Validate and submit
    updateBtn.addEventListener("click", () => {
        const fileName = input.value.trim();

        if (!fileName) {
            input.classList.add("is-invalid");
            errorDiv.style.display = "block";
            return;
        }

        onUpdateFile(currentFileId, fileName);

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
        open(fileId: string, currentName: string) {
            currentFileId = fileId;
            input.value = currentName;
            const bsModal = new (window as any).bootstrap.Modal(modalEl!);
            bsModal.show();
        }
    };
}
