/**
 * Sets up the "Add Folder" modal interaction.
 * 
 * @param onAddFolder - Callback invoked with the trimmed folder name. 
 *                       Implement the actual folder creation logic here.
 */
export default function setupAddFolderModal(onAddFolder: (folderName: string) => void): void {
    const modalEl = document.getElementById("addFolderModal");
    const input = document.getElementById("addFolderModal--folderName") as HTMLInputElement;
    const errorDiv = document.getElementById("addFolderModal--folderNameError");
    const addBtn = document.getElementById("addFolderModal--addBtn") as HTMLButtonElement;

    // Reset form state when modal is opened
    modalEl.addEventListener("show.bs.modal", () => {
        input.value = "";
        input.classList.remove("is-invalid");
        errorDiv.style.display = "none";
    });

    // Validate and submit
    addBtn.addEventListener("click", () => {
        const folderName = input.value.trim();

        if (!folderName) {
            input.classList.add("is-invalid");
            errorDiv.style.display = "block";
            return;
        }

        onAddFolder(folderName);

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
}
