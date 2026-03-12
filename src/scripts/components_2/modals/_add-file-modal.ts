import { ModalBase } from "./base/_modal.base";

export class AddFileModal extends ModalBase {
    private readonly fileNameInputId: string;
    private readonly fileNameErrorId: string;
    private readonly onAddFile: (fileName: string) => void;

    constructor(
        onAddFile: (fileName: string) => void
    ) {
        super(
            "Add New File",
            "Create a new file to add to your document.",
            "Add File"
        );
        this.fileNameInputId = `${this.getModalId()}--fileName`;
        this.fileNameErrorId = `${this.getModalId()}--fileNameError`;
        this.onAddFile = onAddFile;
    }

    protected getModalName(): string {
        return "addFile";
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
        `
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const errorDiv = document.getElementById(this.fileNameErrorId) as HTMLDivElement;
        const input = document.getElementById(this.fileNameInputId) as HTMLInputElement;

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            input.value = "";
            input.classList.remove("is-invalid");
            errorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const fileName = input.value.trim();

            if (!fileName) {
                input.classList.add("is-invalid");
                errorDiv.style.display = "block";
            } else {
                this.onAddFile(fileName);
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
