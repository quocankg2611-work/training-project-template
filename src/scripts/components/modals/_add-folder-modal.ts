import { FolderModelValidator } from "../../models/_folder.model";
import { ModalBase } from "./base/_modal.base";

export class AddFolderModal extends ModalBase {
    private readonly folderNameInputId: string;
    private readonly folderNameErrorId: string;
    private readonly onAddFolder: (folderName: string) => string | null;

    constructor(
        onAddFolder: (folderName: string) => string | null
    ) {
        super(
            "Add New Folder",
            "Create a new folder to organize your documents.",
            "Add Folder"
        );
        this.folderNameInputId = `${this.getModalId()}--folderName`;
        this.folderNameErrorId = `${this.getModalId()}--folderNameError`;
        this.onAddFolder = onAddFolder;
    }

    protected getModalName(): string {
        return "addFolder";
    }

    protected buildBodyHtml(): string {
        return `
            <div class="mb-3">
                <label for="${this.folderNameInputId}"
                        class="form-label">Folder Name</label>
                <input type="text"
                        class="form-control"
                        id="${this.folderNameInputId}"
                        placeholder="e.g. Project Assets"
                        maxlength="40"
                        autocomplete="off" />
                <div class="invalid-feedback"
                        id="${this.folderNameErrorId}">Please enter a folder name.</div>
            </div>
        `
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const folderNameErrorDiv = document.getElementById(this.folderNameErrorId) as HTMLDivElement;
        const folderNameInput = document.getElementById(this.folderNameInputId) as HTMLInputElement;

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            folderNameInput.value = "";
            folderNameInput.classList.remove("is-invalid");
            folderNameErrorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const folderName = folderNameInput.value.trim();
            const folderNameError = FolderModelValidator.validateName(folderName);

            if (folderNameError) {
                folderNameInput.classList.add("is-invalid");
                folderNameErrorDiv.style.display = "block";
                folderNameErrorDiv.textContent = folderNameError;
            }

            if (!folderNameError) {
                const errorMessage = this.onAddFolder(folderName);
                if (errorMessage) {
                    this.raiseGlobalError(errorMessage);
                } else {
                    this.hide();
                }
            }
        });

        // Clear validation on input
        folderNameInput.addEventListener("input", () => {
            if (folderNameInput.value.trim()) {
                folderNameInput.classList.remove("is-invalid");
                folderNameErrorDiv.style.display = "none";
            }
        });
    }
}
