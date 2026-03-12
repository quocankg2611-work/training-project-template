import { ModalBase } from "./base/_modal.base";

export class UpdateFileModal extends ModalBase {
    private readonly fileNameInputId: string;
    private readonly fileNameErrorId: string;
    private readonly onUpdateFile: (fileId: string, fileName: string) => void;

    private currentFileId = "";

    constructor(
        onUpdateFile: (fileId: string, fileName: string) => void
    ) {
        super(
            "Update File",
            "Edit the name of the selected file.",
            "Update File"
        );
        const id = this.getModalId();
        this.fileNameInputId = `${id}--fileName`;
        this.fileNameErrorId = `${id}--fileNameError`;
        this.onUpdateFile = onUpdateFile;
    }

    protected getModalName(): string {
        return "updateFile";
    }

    protected buildBodyHtml(): string {
        return `
            <div class="mb-3">
                <label for="${this.fileNameInputId}"
                        class="form-label">File Name</label>
                <input type="text"
                        class="form-control"
                        id="${this.fileNameInputId}"
                        placeholder="e.g. Project Assets"
                        maxlength="40"
                        autocomplete="off" />
                <div class="invalid-feedback"
                        id="${this.fileNameErrorId}">Please enter a file name.</div>
            </div>
        `;
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const input = document.getElementById(this.fileNameInputId) as HTMLInputElement;
        const errorDiv = document.getElementById(this.fileNameErrorId) as HTMLDivElement;

        // Reset validation state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            input.classList.remove("is-invalid");
            errorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const fileName = input.value.trim();

            if (!fileName) {
                input.classList.add("is-invalid");
                errorDiv.style.display = "block";
                return;
            }

            this.onUpdateFile(this.currentFileId, fileName);
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

    public showWithData(fileId: string, currentName: string): void {
        this.currentFileId = fileId;
        const input = document.getElementById(this.fileNameInputId) as HTMLInputElement;
        input.value = currentName;
        this.show();
    }
}
