import { FileModelValidator } from "../../models/_file.model";
import { ControlledInput } from "../inputs/_controlled-input";
import { ControlledSelect } from "../inputs/_controlled-select";
import { ModalBase } from "./base/_modal.base";

export class AddFileModal extends ModalBase {
    private readonly fileNameInputPlaceholderId: string;
    private readonly fileTypeSelecPlaceholderId: string;
    private readonly fileNameInput: ControlledInput;
    private readonly fileTypeSelect: ControlledSelect;

    constructor(
        private readonly onAddFile: (fileName: string, extension: string, content: string) => string | null
    ) {
        super(
            "Add New File",
            "Create a new file to add to your document.",
            "Add File"
        );
        this.fileNameInputPlaceholderId = `${this.getModalId()}--fileName`;
        this.fileTypeSelecPlaceholderId = `${this.getModalId()}--fileType`;
        this.onAddFile = onAddFile;

        this.fileNameInput = new ControlledInput(
            {
                label: "File Name",
                placeholder: "e.g. Project Assets",
                maxLength: 40,
                placeholderId: this.fileNameInputPlaceholderId,
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
                placeholderId: this.fileTypeSelecPlaceholderId,
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
    }

    protected getModalName(): string {
        return "addFile";
    }

    protected buildBodyHtml(): string {
        return `
            <div class="mb-3">
                <div id="${this.fileNameInputPlaceholderId}"></div>
                <div id="${this.fileTypeSelecPlaceholderId}"></div>
            </div>
        `
    }

    protected onAfterRender(): void {
        this.fileNameInput.bootstrap();
        this.fileTypeSelect.bootstrap();

        const confirmBtn = this.getModalSubmitBtn();

        // Reset form state when modal is opened
        const modalEl = this.getModalElement();
        modalEl.addEventListener("show.bs.modal", () => {
            this.fileNameInput.clearInput();
            this.fileNameInput.clearError();
            this.fileTypeSelect.clearInput();
            this.fileTypeSelect.clearError();
        });

        // Validate and submit
        confirmBtn.addEventListener("click", () => {
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
        });
    }
}
