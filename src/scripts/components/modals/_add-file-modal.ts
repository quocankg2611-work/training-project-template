import { FileModelValidator } from "../../models/_file.model";
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
                        id="${this.fileNameErrorId}"></div>
                
                <label for="${this.fileTypeSelectId}"
                        class="form-label mt-3">File Type</label>
                <select class="form-select"
                        id="${this.fileTypeSelectId}">
                    <option value="word">Word Document (.docx)</option>
                    <option value="excel">Excel Spreadsheet (.xlsx)</option>
                    <option value="powerpoint">PowerPoint Presentation (.pptx)</option>
                    <option value="pdf">PDF Document (.pdf)</option>
                    <option value="text">Text File (.txt)</option>
                    <option value="csv">CSV File (.csv)</option>
                </select>
                <div class="invalid-feedback"
                        id="${this.fileTypeErrorId}"></div>
            </div>
        `
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const fileNameInput = document.getElementById(this.fileNameInputId) as HTMLInputElement;
        const fileNameErrorDiv = document.getElementById(this.fileNameErrorId) as HTMLDivElement;
        const fileTypeSelect = document.getElementById(this.fileTypeSelectId) as HTMLSelectElement;
        const fileTypeErrorDiv = document.getElementById(this.fileTypeErrorId) as HTMLDivElement;

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            fileNameInput.value = "";
            fileNameInput.classList.remove("is-invalid");
            fileNameErrorDiv.style.display = "none";
            fileTypeSelect.value = "";
            fileTypeSelect.classList.remove("is-invalid");
            fileTypeErrorDiv.style.display = "none";
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            const fileName = fileNameInput.value.trim();
            const fileType = fileTypeSelect.value;

            const fileNameError = FileModelValidator.validateFileName(fileName);
            const fileTypeError = FileModelValidator.validateFileType(fileType);

            if (fileNameError) {
                fileNameInput.classList.add("is-invalid");
                fileNameErrorDiv.style.display = "block";
                fileNameErrorDiv.textContent = fileNameError;
            }
            if (fileTypeError) {
                fileTypeSelect.classList.add("is-invalid");
                fileTypeErrorDiv.style.display = "block";
                fileTypeErrorDiv.textContent = fileTypeError;
            }
            if (!fileNameError && !fileTypeError) {
                this.onAddFile(fileName, fileType, ""); // Pass an empty content for now (since we are adding file)
                this.hide();
            }
        });

        // Clear validation on input
        fileNameInput.addEventListener("input", () => {
            if (fileNameInput.value.trim()) {
                fileNameInput.classList.remove("is-invalid");
                fileNameErrorDiv.style.display = "none";
            }
        });
        fileTypeSelect.addEventListener("change", () => {
            if (fileTypeSelect.value) {
                fileTypeSelect.classList.remove("is-invalid");
                fileTypeErrorDiv.style.display = "none";
            }
        });
    }
}
