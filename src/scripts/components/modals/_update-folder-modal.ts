import { FileModelValidator } from "../../models/_file.model";
import { ControlledInput } from "../inputs/texts/_controlled-input-text";
import { ActionModalBase } from "./base/_action-modal.base";

export class UpdateFolderNameModal extends ActionModalBase {
    private currentFolderId = "";
    private readonly folderNameInput: ControlledInput;

    constructor(
        private readonly onUpdateFolderName: (folderId: string, folderName: string) => string | null
    ) {
        super(
            {
                modalType: "updateFolderName",
                onModalConfirmed: () => {
                    const isFolderNameValid = this.folderNameInput.validate();
                    if (isFolderNameValid) {
                        const folderName = this.folderNameInput.getValue();
                        const errorMessage = this.onUpdateFolderName(this.currentFolderId, folderName);
                        if (errorMessage != null) {
                            this.raiseGlobalError(errorMessage);
                        } else {
                            this.hide();
                        }
                    }
                },
                onModalShow: () => {
                    this.folderNameInput.clearError();
                }
            },
            "Update Folder",
            "Edit the name of the selected folder.",
            "Update Folder"
        );

        const folderNameInputPlaceholderId = `${this.bodyId}--folderName`;
        this.folderNameInput = new ControlledInput(
            {
                label: "Folder Name",
                maxLength: 40,
                placeholder: "e.g. Project Assets",
                placeholderId: folderNameInputPlaceholderId,
                onInput: (_) => {
                    this.folderNameInput.clearError();
                }
            },
            (value) => FileModelValidator.validateName(value)
        );

        const bodyHtml = `
            <div>
                <div id="${folderNameInputPlaceholderId}"></div>
            </div>
        `;
        const bodyElement = document.getElementById(this.bodyId);
        bodyElement.innerHTML = bodyHtml;

        this.folderNameInput.bootstrap();
    }

    public showWithData(folderId: string, currentName: string): void {
        this.currentFolderId = folderId;
        this.folderNameInput.setInputValue(currentName);
        this.show();
    }
}
