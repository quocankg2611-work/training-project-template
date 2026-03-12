import { ModalBase } from "./base/_modal.base";

export class AddFileModal extends ModalBase {
    private readonly fileNameInputId: string;
    private readonly fileNameErrorId: string;
    private readonly fileTypeSelectId: string;
    private readonly fileTypeErrorId: string;

    constructor(
        private readonly onAddFile: (fileName: string, extension: string, content: string) => void
    ) {
        super(
            "Add New File",
            "Create a new file to add to your document.",
            "Add File"
        );
        this.fileNameInputId = `${this.getModalId()}--fileName`;
        this.fileNameErrorId = `${this.getModalId()}--fileNameError`;
        this.fileTypeSelectId = `${this.getModalId()}--fileType`;
        this.fileTypeErrorId = `${this.getModalId()}--fileTypeError`;
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
                
                <label for="${this.fileTypeSelectId}"
                        class="form-label mt-3">File Type</label>
                <select class="form-select"
                        id="${this.fileTypeSelectId}">
                    <option value="docx">Word Document (.docx)</option>
                    <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                    <option value="pptx">PowerPoint Presentation (.pptx)</option>
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="txt">Text File (.txt)</option>
                    <option value="csv">CSV File (.csv)</option>
                </select>
                <div class="invalid-feedback"
                        id="${this.fileTypeErrorId}">Please select a file type.</div>
            </div>
        `
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const errorDiv = document.getElementById(this.fileNameErrorId) as HTMLDivElement;
        const fileNameInput = document.getElementById(this.fileNameInputId) as HTMLInputElement;
        const fileTypeSelect = document.getElementById(this.fileTypeSelectId) as HTMLSelectElement;

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            fileNameInput.value = "";
            fileNameInput.classList.remove("is-invalid");
            errorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const fileName = fileNameInput.value.trim();
            const fileType = fileTypeSelect.value;

            if (!fileName) {
                fileNameInput.classList.add("is-invalid");
                errorDiv.style.display = "block";
                return;
            }
            if (!fileType) {
                const fileTypeErrorDiv = document.getElementById(this.fileTypeErrorId) as HTMLDivElement;
                fileTypeSelect.classList.add("is-invalid");
                fileTypeErrorDiv.style.display = "block";
                return;
            }
            this.onAddFile(fileName, fileType, ""); // Pass an empty content for now
            this.hide();
        });

        // Clear validation on input
        fileNameInput.addEventListener("input", () => {
            if (fileNameInput.value.trim()) {
                fileNameInput.classList.remove("is-invalid");
                errorDiv.style.display = "none";
            }
        });
    }
}
