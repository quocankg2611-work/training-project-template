import { ModalBase } from "./base/_modal.base";

export class UploadFileModal extends ModalBase {
    private readonly fileInputId: string;
    private readonly fileInputErrorId: string;
    private readonly uploadedFileGroupId: string;
    private readonly uploadedFileNameId: string;
    private readonly fileNameGroupId: string;
    private readonly fileNameInputId: string;
    private readonly fileNameErrorId: string;
    private readonly onUploadFile: (fileName: string, extension: string, content: string) => void;

    private static readonly ALLOWED_EXTENSIONS = ["docx", "xlsx"];

    constructor(
        onUploadFile: (fileName: string, extension: string, content: string) => void
    ) {
        super(
            "Upload File",
            "Upload a document to add to your folder.",
            "Upload File"
        );
        const id = this.getModalId();
        this.fileInputId = `${id}--fileInput`;
        this.fileInputErrorId = `${id}--fileInputError`;
        this.uploadedFileGroupId = `${id}--uploadedFileGroup`;
        this.uploadedFileNameId = `${id}--uploadedFileName`;
        this.fileNameGroupId = `${id}--fileNameGroup`;
        this.fileNameInputId = `${id}--fileNameInput`;
        this.fileNameErrorId = `${id}--fileNameError`;
        this.onUploadFile = onUploadFile;
    }

    protected getModalName(): string {
        return "uploadFile";
    }

    protected buildBodyHtml(): string {
        return `
            <div class="mb-3">
                <label for="${this.fileInputId}"
                        class="form-label">Select File</label>
                <input type="file"
                        class="form-control"
                        id="${this.fileInputId}"
                        accept=".docx,.xlsx" />
                <div class="invalid-feedback"
                        id="${this.fileInputErrorId}">Please select a file to upload.</div>
            </div>
            <div class="mb-3" id="${this.uploadedFileGroupId}" style="display:none;">
                <label class="form-label">Uploaded File</label>
                <input type="text"
                        class="form-control"
                        id="${this.uploadedFileNameId}"
                        readonly />
            </div>
            <div class="mb-3" id="${this.fileNameGroupId}" style="display:none;">
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
        const fileInput = document.getElementById(this.fileInputId) as HTMLInputElement;
        const fileInputError = document.getElementById(this.fileInputErrorId) as HTMLDivElement;
        const uploadedFileGroup = document.getElementById(this.uploadedFileGroupId) as HTMLDivElement;
        const uploadedFileName = document.getElementById(this.uploadedFileNameId) as HTMLInputElement;
        const fileNameGroup = document.getElementById(this.fileNameGroupId) as HTMLDivElement;
        const fileNameInput = document.getElementById(this.fileNameInputId) as HTMLInputElement;
        const fileNameError = document.getElementById(this.fileNameErrorId) as HTMLDivElement;

        let fileContent = "";
        let fileExtension = "";

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            fileInput.value = "";
            fileInput.classList.remove("is-invalid");
            fileInputError.style.display = "none";
            uploadedFileGroup.style.display = "none";
            uploadedFileName.value = "";
            fileNameGroup.style.display = "none";
            fileNameInput.value = "";
            fileNameInput.classList.remove("is-invalid");
            fileNameError.style.display = "none";
            fileContent = "";
            fileExtension = "";
        });

        // When a file is selected, read its content and show name fields
        fileInput.addEventListener("change", () => {
            if (!fileInput.files || fileInput.files.length === 0) return;

            const file = fileInput.files[0];
            const dotIndex = file.name.lastIndexOf(".");
            const ext = dotIndex > 0 ? file.name.substring(dotIndex + 1).toLowerCase() : "";

            if (!UploadFileModal.ALLOWED_EXTENSIONS.includes(ext)) {
                fileInput.classList.add("is-invalid");
                fileInputError.textContent = "Only .docx and .xlsx files are allowed.";
                fileInputError.style.display = "block";
                uploadedFileGroup.style.display = "none";
                fileNameGroup.style.display = "none";
                fileContent = "";
                fileExtension = "";
                return;
            }

            fileInput.classList.remove("is-invalid");
            fileInputError.style.display = "none";

            const baseName = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;
            fileExtension = ext;

            uploadedFileName.value = file.name;
            uploadedFileGroup.style.display = "block";

            fileNameInput.value = baseName;
            fileNameGroup.style.display = "block";

            const reader = new FileReader();
            reader.onload = () => {
                fileContent = reader.result as string;
            };
            reader.readAsText(file);
        });

        // Clear file name validation on input
        fileNameInput.addEventListener("input", () => {
            if (fileNameInput.value.trim()) {
                fileNameInput.classList.remove("is-invalid");
                fileNameError.style.display = "none";
            }
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            let hasError = false;

            if (!fileInput.files || fileInput.files.length === 0) {
                fileInput.classList.add("is-invalid");
                fileInputError.textContent = "Please select a file to upload.";
                fileInputError.style.display = "block";
                hasError = true;
            }

            const fileName = fileNameInput.value.trim();
            if (!fileName) {
                fileNameInput.classList.add("is-invalid");
                fileNameError.style.display = "block";
                hasError = true;
            }

            if (hasError) return;

            this.onUploadFile(fileName, fileExtension, fileContent);
            this.hide();
        });
    }
}