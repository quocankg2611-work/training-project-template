import { FileModelValidator } from "../../models/_file.model";
import { ControlledInput } from "../inputs/_controlled-input";
import { ControlledSelect } from "../inputs/_controlled-select";
import { ModalBase2 } from "./base/_modal.base2";

export class AddFileModal extends ModalBase2 {
    private readonly fileNameInput: ControlledInput;
    private readonly fileTypeSelect: ControlledSelect;

    constructor(
        private readonly onAddFile: (fileName: string, extension: string, content: string) => string | null
    ) {
        super(
            {
                modalType: "addFile",
                onModalConfirmed: () => {
                    const fileName = this.fileNameInput.getValue();
                    const fileType = this.fileTypeSelect.getValue();

                    const isFileNameValid = this.fileNameInput.validate();
                    const isFileTypeValid = this.fileTypeSelect.validate();

                    if (isFileNameValid && isFileTypeValid) {
                        const errorMessage = this.onAddFile(fileName, fileType, ""); // Pass an empty content for now (since we are adding file)
                        if (errorMessage === null) {
                            this.hide();
                        } else {
                            this.raiseGlobalError(errorMessage);
                        }
                    }
                },
                onModalShow: () => {
                    this.fileNameInput.clearInput();
                    this.fileNameInput.clearError();
                    this.fileTypeSelect.clearInput();
                    this.fileTypeSelect.clearError();
                }
            },
            "Add New File",
            "Create a new file to add to your document.",
            "Add File",
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

        this.fileTypeSelect = new ControlledSelect(
            {
                label: "File Type",
                placeholder: "Select a file type",
                placeholderId: fileTypeSelectPlaceholderId,
                valueTextPairs: [
                    { value: "word", text: "Word Document (.docx)" },
                    { value: "excel", text: "Excel Spreadsheet (.xlsx)" },
                    { value: "powerpoint", text: "PowerPoint Presentation (.pptx)" },
                    { value: "pdf", text: "PDF Document (.pdf)" },
                    { value: "text", text: "Text File (.txt)" },
                    { value: "csv", text: "CSV File (.csv)" }
                ],
                onSelect: (_) => {
                    this.fileTypeSelect.clearError();
                },
            },
            (value) => FileModelValidator.validateType(value)
        );


        const bodyHtml = `
            <div class="d-flex flex-column gap-3">
                <div id="${fileNameInputPlaceholderId}"></div>
                <div id="${fileTypeSelectPlaceholderId}"></div>
            </div>
        `;
        const body = document.getElementById(this.bodyId);
        body.innerHTML = bodyHtml;
        this.fileNameInput.bootstrap();
        this.fileTypeSelect.bootstrap();
    }
}
