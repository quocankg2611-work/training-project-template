import { ControlledFilesInput } from "../inputs/files/_controlled-input-files";
import { ModalBase } from "./base/_modal.base";
import { FileModelValidator } from "../../models/_file.model";

export class UploadFileModal extends ModalBase {
    private readonly fileUploadInput: ControlledFilesInput

    constructor(
        onUploadFiles: (files: File[]) => string | null,
    ) {
        super(
            {
                modalType: "uploadFile",
                onModalConfirmed: () => {
                    const isFilesValid = this.fileUploadInput.validate();
                    if (isFilesValid) {
                        const files = this.fileUploadInput.getValue();
                        const errorMessage = onUploadFiles(files);
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
                acceptedExtensions: [], // Accept all file types
                onInput(files) {

                },
            },
            (value) => FileModelValidator.validateFiles(value, false)
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
