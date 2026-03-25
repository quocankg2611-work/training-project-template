import { FolderModelValidator } from "../../models/_folder.model";
import { ControlledInput } from "../inputs/texts/_controlled-input-text";
import { ModalBase } from "./base/_modal.base";

export class AddFolderModal extends ModalBase {
    private readonly folderNameInput: ControlledInput;

    constructor(
        private readonly onAddFolder: (folderName: string) => string | null
    ) {
        super(
            {
                modalType: "addFolder",
                onModalConfirmed: () => {
                    const isFolderNameValid = this.folderNameInput.validate();
                    if (isFolderNameValid) {
                        const folderName = this.folderNameInput.getValue();
                        const errorMessage = this.onAddFolder(folderName);
                        if (errorMessage) {
                            this.raiseGlobalError(errorMessage);
                        } else {
                            this.hide();
                        }
                    }
                },
                onModalShow: () => {
                    this.folderNameInput.clearInput();
                    this.folderNameInput.clearError();
                }
            },
            "Add New Folder",
            "Create a new folder to organize your documents.",
            "Add Folder"
        );
        const folderNameInputPlaceholderId = `${this.bodyId}--folderName`;
        this.folderNameInput = new ControlledInput(
            {
                label: "Folder Name",
                placeholder: "e.g. Project Assets",
                maxLength: 40,
                placeholderId: folderNameInputPlaceholderId,
                onInput: (_) => {
                    this.folderNameInput.clearError();
                }
            },
            (value) => FolderModelValidator.validateName(value)
        );

        const bodyHtml = `
            <div>
                <div id="${folderNameInputPlaceholderId}"></div>
            </div>
        `;
        const body = document.getElementById(this.bodyId);
        body.innerHTML = bodyHtml;
        this.folderNameInput.bootstrap();
    }
}
