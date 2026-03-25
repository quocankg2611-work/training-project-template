import { FolderModelValidator } from "../../models/_folder.model";
import { ControlledFoldersInput } from "../inputs/files/_controlled-input-folder";
import { ControlledInput } from "../inputs/texts/_controlled-input-text";
import { ModalBase } from "./base/_modal.base";

export class UploadFolderModal extends ModalBase {
    private readonly nameInput: ControlledInput;
    private readonly folderInput: ControlledFoldersInput;

    constructor(
        onUploadFolder: (folderName: string, files: File[]) => void
    ) {
        super(
            {
                modalType: "uploadFolder",
                onModalConfirmed: () => {
                    // Todo
                    onUploadFolder("Example Folder Name", []); // Pass an empty file array for now (since we are not actually uploading files in this example)
                    this.hide();
                },
                onModalShow: () => {
                    // Todo
                }
            },
            "Upload Folder",
            "Upload a folder to add to your document.",
            "Upload Folder"
        );
        const nameInputPlaceholderId = `${this.bodyId}--folderName`;
        this.nameInput = new ControlledInput(
            {
                label: "Folder Name",
                placeholder: "e.g. Project Assets",
                maxLength: 40,
                placeholderId: nameInputPlaceholderId,
                onInput: (_) => {
                    this.nameInput.clearError();
                }
            },
            (value) => FolderModelValidator.validateName(value)
        );

        const folderInputPlaceholderId = `${this.bodyId}--folderInput`;
        this.folderInput = new ControlledFoldersInput(
            {
                acceptedExtensions: [], // Accept all file types
                label: "Select Folder",
                placeholderId: folderInputPlaceholderId,
                onInput: (files) => {
                    // Todo - maybe display selected folder name somewhere in the modal?
                }
            },
            // For folder validation, we can check if at least one file is selected (since we can't validate the folder name until we extract it from the file paths)
            (files) => {
                if (files.length === 0) {
                    return "Please select a folder to upload.";
                }
                return null;
            }
        );

        const bodyHtml = `
            <div>
                <div id="${nameInputPlaceholderId}"></div>
                <div id="${folderInputPlaceholderId}"></div>
            </div>
        `;
        const body = document.getElementById(this.bodyId);
        body.innerHTML = bodyHtml;
        this.nameInput.bootstrap();
        this.folderInput.bootstrap();
    }
}

