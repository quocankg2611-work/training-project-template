import { ModalBase } from "./base/_modal.base";

export class UploadFolderModal extends ModalBase {
    private readonly folderInputId: string;
    private readonly folderInputErrorId: string;
    private readonly uploadedFolderGroupId: string;
    private readonly uploadedFolderNameId: string;
    private readonly folderNameGroupId: string;
    private readonly folderNameInputId: string;
    private readonly folderNameErrorId: string;
    private readonly onUploadFolder: (folderName: string, files: File[]) => void;

    constructor(
        onUploadFolder: (folderName: string, files: File[]) => void
    ) {
        super(
            "Upload Folder",
            "Upload a folder to add to your document.",
            "Upload Folder"
        );
        const id = this.getModalId();
        this.folderInputId = `${id}--folderInput`;
        this.folderInputErrorId = `${id}--folderInputError`;
        this.uploadedFolderGroupId = `${id}--uploadedFolderGroup`;
        this.uploadedFolderNameId = `${id}--uploadedFolderName`;
        this.folderNameGroupId = `${id}--folderNameGroup`;
        this.folderNameInputId = `${id}--folderNameInput`;
        this.folderNameErrorId = `${id}--folderNameError`;
        this.onUploadFolder = onUploadFolder;
    }

    protected getModalName(): string {
        return "uploadFolder";
    }

    protected buildBodyHtml(): string {
        return `
            <div class="mb-3">
                <label for="${this.folderInputId}"
                        class="form-label">Select Folder</label>
                <input type="file"
                        class="form-control"
                        id="${this.folderInputId}"
                        webkitdirectory />
                <div class="invalid-feedback"
                        id="${this.folderInputErrorId}">Please select a folder to upload.</div>
            </div>
            <div class="mb-3" id="${this.uploadedFolderGroupId}" style="display:none;">
                <label class="form-label">Uploaded Folder</label>
                <input type="text"
                        class="form-control"
                        id="${this.uploadedFolderNameId}"
                        readonly />
            </div>
            <div class="mb-3" id="${this.folderNameGroupId}" style="display:none;">
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
        const folderInput = document.getElementById(this.folderInputId) as HTMLInputElement;
        const folderInputError = document.getElementById(this.folderInputErrorId) as HTMLDivElement;
        const uploadedFolderGroup = document.getElementById(this.uploadedFolderGroupId) as HTMLDivElement;
        const uploadedFolderName = document.getElementById(this.uploadedFolderNameId) as HTMLInputElement;
        const folderNameGroup = document.getElementById(this.folderNameGroupId) as HTMLDivElement;
        const folderNameInput = document.getElementById(this.folderNameInputId) as HTMLInputElement;
        const folderNameError = document.getElementById(this.folderNameErrorId) as HTMLDivElement;

        let selectedFiles: File[] = [];

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            folderInput.value = "";
            folderInput.classList.remove("is-invalid");
            folderInputError.style.display = "none";
            uploadedFolderGroup.style.display = "none";
            uploadedFolderName.value = "";
            folderNameGroup.style.display = "none";
            folderNameInput.value = "";
            folderNameInput.classList.remove("is-invalid");
            folderNameError.style.display = "none";
            selectedFiles = [];
        });

        // When a folder is selected, extract its name and show name fields
        folderInput.addEventListener("change", () => {
            if (!folderInput.files || folderInput.files.length === 0) return;

            selectedFiles = Array.from(folderInput.files);

            // Extract the top-level folder name from the first file's relative path
            const relativePath = (selectedFiles[0] as any).webkitRelativePath as string;
            const folderName = relativePath ? relativePath.split("/")[0] : selectedFiles[0].name;

            folderInput.classList.remove("is-invalid");
            folderInputError.style.display = "none";

            uploadedFolderName.value = folderName;
            uploadedFolderGroup.style.display = "block";

            folderNameInput.value = folderName;
            folderNameGroup.style.display = "block";
        });

        // Clear folder name validation on input
        folderNameInput.addEventListener("input", () => {
            if (folderNameInput.value.trim()) {
                folderNameInput.classList.remove("is-invalid");
                folderNameError.style.display = "none";
            }
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
            let hasError = false;

            if (selectedFiles.length === 0) {
                folderInput.classList.add("is-invalid");
                folderInputError.style.display = "block";
                hasError = true;
            }

            const folderName = folderNameInput.value.trim();
            if (!folderName) {
                folderNameInput.classList.add("is-invalid");
                folderNameError.style.display = "block";
                hasError = true;
            }

            if (hasError) return;

            this.onUploadFolder(folderName, selectedFiles);
            this.hide();
        });
    }
}