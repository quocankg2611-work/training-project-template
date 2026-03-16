import { ControlledInput } from "../inputs/texts/_controlled-input-text";
import { ControlledFilesInput } from "../inputs/files/_controlled-input-files";
import { ModalBase2 } from "./base/_modal.base2";
import { FileModelValidator } from "../../models/_file.model";

export class UploadFileModal extends ModalBase2 {
    private readonly fileUploadInput: ControlledFilesInput

    constructor(
        private readonly onUploadFiles: (files: File[]) => string | null,
    ) {
        super(
            {
                modalType: "uploadFile",
                onModalConfirmed: () => {
                    const isFilesValid = this.fileUploadInput.validate();
                    if (isFilesValid) {
                        const files = this.fileUploadInput.getValue();
                        const errorMessage = this.onUploadFiles(files);
                        if (errorMessage != null) {
                            this.raiseGlobalError(errorMessage);
                        } else {
                            this.hide();
                        }
                    }
                },
                onModalShow: () => {
                    this.fileUploadInput.clearInput();
                    this.fileUploadInput.clearError();
                },
            },
            "Upload File",
            "Upload a document to add to your folder.",
            "Upload File"
        );

        const fileUploadPlaceholderId = `${this.bodyId}--fileInput`;
        const fileNamePlaceholderId = `${this.bodyId}--fileNameInput`;

        this.fileUploadInput = new ControlledFilesInput(
            {
                label: "Select File",
                placeholderId: fileUploadPlaceholderId,
                acceptedExtensions: FileModelValidator.ALLOWED_EXTENSIONS,
                onInput(files) {

                },
            },
            (value) => FileModelValidator.validateRawFiles(value)
        );

        const bodyHtml = `
            <div>
                <div id="${fileUploadPlaceholderId}"></div>
            </div>
        `;
        const bodyElement = document.getElementById(this.bodyId);
        bodyElement.innerHTML = bodyHtml;
        this.fileUploadInput.bootstrap();
    }
}
