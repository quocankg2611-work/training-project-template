import { ModalBase } from "./base/_modal.base";

export class UpdateFolderModal extends ModalBase {
    private readonly folderNameInputId: string;
    private readonly folderNameErrorId: string;
    private readonly onUpdateFolder: (folderId: string, folderName: string) => void;

    private currentFolderId = "";

    constructor(
        onUpdateFolder: (folderId: string, folderName: string) => void
    ) {
        super(
            "Update Folder",
            "Edit the name of the selected folder.",
            "Update Folder"
        );
        const id = this.getModalId();
        this.folderNameInputId = `${id}--folderName`;
        this.folderNameErrorId = `${id}--folderNameError`;
        this.onUpdateFolder = onUpdateFolder;
    }

    protected getModalName(): string {
        return "updateFolder";
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
        `;
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const input = document.getElementById(this.folderNameInputId) as HTMLInputElement;
        const errorDiv = document.getElementById(this.folderNameErrorId) as HTMLDivElement;

        // Reset validation state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            input.classList.remove("is-invalid");
            errorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const folderName = input.value.trim();

            if (!folderName) {
                input.classList.add("is-invalid");
                errorDiv.style.display = "block";
                return;
            }

            this.onUpdateFolder(this.currentFolderId, folderName);
            this.hide();
        });

        // Clear validation on input
        input.addEventListener("input", () => {
            if (input.value.trim()) {
                input.classList.remove("is-invalid");
                errorDiv.style.display = "none";
            }
        });
    }

    public showWithData(folderId: string, currentName: string): void {
        this.currentFolderId = folderId;
        const input = document.getElementById(this.folderNameInputId) as HTMLInputElement;
        input.value = currentName;
        this.show();
    }
}
