import { FileModelValidator } from "../../models/_file.model";
import { ControlledInput } from "../inputs/texts/_controlled-input-text";
import { ModalBase2 } from "./base/_modal.base2";

export class UpdateFileModal extends ModalBase2 {
    private currentFileId: string = "";
    private readonly fileNameInput: ControlledInput;

    constructor(
        private readonly onUpdateFile: (fileId: string, fileName: string) => string | null
    ) {
        super(
            {
                modalType: "updateFile",
                onModalConfirmed: () => {
                    const isFileNameValid = this.fileNameInput.validate();
                    if (isFileNameValid) {
                        const fileName = this.fileNameInput.getValue();
                        const errorMessage = this.onUpdateFile(this.currentFileId, fileName);
                        if (errorMessage != null) {
                            this.raiseGlobalError(errorMessage);
                        } else {
                            this.hide();
                        }
                    }
                },
                onModalShow: () => {
                    this.fileNameInput.clearError();
                }
            },
            "Update File",
            "Edit the name of the selected file.",
            "Update File"
        );

        const fileNameInputPlaceholderId = `${this.bodyId}--fileName`;
        const fileTypeSelectPlaceholderId = `${this.bodyId}--fileType`;

        this.fileNameInput = new ControlledInput(
            {
                label: "File Name",
                placeholder: "e.g. Project Assets",
                maxLength: 40,
                placeholderId: fileNameInputPlaceholderId,
                onInput: (_) => {
                    this.fileNameInput.clearError();
                }
            },
            (value) => FileModelValidator.validateName(value)
        );

        const bodyHtml = `
            <div>
                <div id="${fileNameInputPlaceholderId}"></div>
                <div id="${fileTypeSelectPlaceholderId}"></div>
            </div>
        `;
        const bodyElement = document.getElementById(this.bodyId);
        bodyElement.innerHTML = bodyHtml;

        this.fileNameInput.bootstrap();
    }

    public showWithData(fileId: string, currentName: string): void {
        this.currentFileId = fileId;
        this.fileNameInput.setInputValue(currentName);
        this.show();
    }
}
