import { FileModelValidator } from "../../models/_file.model";
import { ControlledFoldersInput } from "../inputs/files/_controlled-input-folder";
import { ActionModalBase } from "./base/_action-modal.base";

export class UploadFolderModal extends ActionModalBase {
    private readonly folderInput: ControlledFoldersInput;
    private readonly selectedFolderNamePlaceholderId: string = `${this.bodyId}--selectedFolderName`;
    private selectedFolderName: string | null = null;

    constructor(
        onUploadFolder: (files: File[]) => string | null,
    ) {
        super(
            {
                modalType: "uploadFolder",
                onModalConfirmed: () => {
                    const isFilesValid = this.folderInput.validate();
                    if (isFilesValid) {
                        const files = this.folderInput.getValue();
                        const errorMessage = onUploadFolder(files);
                        if (errorMessage != null) {
                            this.raiseGlobalError(errorMessage);
                        } else {
                            this.hide();
                        }
                    }
                },
                onModalShow: () => {
                    this.selectedFolderName = null;
                    this.folderInput.clearError();
                    this.folderInput.clearInput();
                }
            },
            "Upload Folder",
            "Upload a folder to add to your document.",
            "Upload Folder"
        );

        const folderInputPlaceholderId = `${this.bodyId}--folderInput`;
        this.folderInput = new ControlledFoldersInput(
            {
                acceptedExtensions: [], // Accept all file types
                label: "Select Folder",
                placeholderId: folderInputPlaceholderId,
                onInput: (files) => {
                    if (files.length > 0) {
                        this.selectedFolderName = files[0].webkitRelativePath.split("/")[0];
                        const selectedFolderNameElement = document.getElementById(this.selectedFolderNamePlaceholderId);
                        if (selectedFolderNameElement) {
                            selectedFolderNameElement.textContent = this.selectedFolderName;
                        }
                    }
                }
            },
            (files) => FileModelValidator.validateFiles(files, true)
        );

        const bodyHtml = `
            <div>
                <div style="font-size: 14px; color: #555; margin-bottom: 10px;">
                    Please select a folder to upload. The folder's name will be used as the document name, and all files within the folder (including subfolders) will be uploaded.
                </div>

                <div id="${this.selectedFolderNamePlaceholderId}"></div>

                <div id="${folderInputPlaceholderId}"></div>
            </div>
        `;
        const body = document.getElementById(this.bodyId);
        body.innerHTML = bodyHtml;
        this.folderInput.bootstrap();
    }
}

