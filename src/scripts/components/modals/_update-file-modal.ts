import { FileModelValidator } from "../../models/_file.model";
import { ModalBase } from "./base/_modal.base";

export class UpdateFileModal extends ModalBase {
    private readonly fileNameInputId: string;
    private readonly fileNameErrorId: string;
    private readonly fileTypeSelectId: string;
    private readonly fileTypeErrorId: string;
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
        this.fileTypeSelectId = `${id}--fileType`;
        this.fileTypeErrorId = `${id}--fileTypeError`;
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
        `;
    }

    protected onAfterRender(): void {
        const confirmBtn = this.getModalSubmitBtn();
        const fileNameInput = document.getElementById(this.fileNameInputId) as HTMLInputElement;
        const fileNameErrorDiv = document.getElementById(this.fileNameErrorId) as HTMLDivElement;
        const fileTypeSelect = document.getElementById(this.fileTypeSelectId) as HTMLSelectElement;
        const fileTypeErrorDiv = document.getElementById(this.fileTypeErrorId) as HTMLDivElement;

        // Reset validation state when modal is opened
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
            const fileNameError = FileModelValidator.validateName(fileName);
            

            if (fileNameError) {
                fileNameInput.classList.add("is-invalid");
                fileNameErrorDiv.style.display = "block";
                fileNameErrorDiv.textContent = fileNameError;
            }

            this.onUpdateFile(this.currentFileId, fileName);
            this.hide();
        });

        // Clear validation on input
        fileNameInput.addEventListener("input", () => {
            if (fileNameInput.value.trim()) {
                fileNameInput.classList.remove("is-invalid");
                fileNameErrorDiv.style.display = "none";
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
