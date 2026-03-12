import { ModalBase } from "./base/_modal.base";

export class AddFolderModal extends ModalBase {
    private readonly folderNameInputId: string;
    private readonly folderNameErrorId: string;
    private readonly onAddFolder: (folderName: string) => void;

    constructor(
        onAddFolder: (folderName: string) => void
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
        const errorDiv = document.getElementById(this.folderNameErrorId) as HTMLDivElement;
        const input = document.getElementById(this.folderNameInputId) as HTMLInputElement;

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            input.value = "";
            input.classList.remove("is-invalid");
            errorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const folderName = input.value.trim();

            if (!folderName) {
                input.classList.add("is-invalid");
                errorDiv.style.display = "block";
            } else {
                this.onAddFolder(folderName);
                this.hide();
            }
        });

        // Clear validation on input
        input.addEventListener("input", () => {
            if (input.value.trim()) {
                input.classList.remove("is-invalid");
                errorDiv.style.display = "none";
            }
        });
    }
}
