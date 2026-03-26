import { HtmlUtils } from "../../../utilities/_html";
import { ControlledInputBase } from "../_controlled-input.base";

type ControlledFolderInputProps = {
    label: string;
    placeholderId: string;
    acceptedExtensions: string[];
    onInput?: (files: File[]) => void;
}

export class ControlledFoldersInput extends ControlledInputBase {
    private selectedFiles: File[] = [];

    constructor(
        private readonly props: ControlledFolderInputProps,
        private readonly validationFunction?: (value: File[]) => string | null,
    ) { super(); }

    private attachInputHtml(
        placeholderId: string,
        label: string,
    ): void {
        const acceptAttribute = this.props.acceptedExtensions.map((ext) => `.${ext}`).join(",");

        const html = `
            <div id="${this.id}">
                <label for="${this.inputId}"
                    class="form-label">${label}</label>
                <input type="file"
                    class="form-control"
                    id="${this.inputId}"
                    accept="${acceptAttribute}"
                    webkitdirectory
                    directory
                    multiple />
                <div class="invalid-feedback"
                    id="${this.errorId}"></div>
            </div>
        `;
        const element = HtmlUtils.stringToSingleHtmlElement(html);
        HtmlUtils.replaceElementWithHtml(placeholderId, element);
    }

    private clearSelection(): void {
        const inputElement = this.getInputElement();
        inputElement.value = "";
        this.selectedFiles = [];
    }

    private attachInputListener(
        onInput?: (files: File[]) => void
    ): void {
        const inputElement = this.getInputElement();
        inputElement.addEventListener("change", () => {
            if (!inputElement.files || inputElement.files.length === 0) {
                this.selectedFiles = [];
                return;
            }

            const files = Array.from(inputElement.files);
            const acceptedExtensions = this.props.acceptedExtensions;
            const hasInvalidFile = acceptedExtensions.length > 0 && files.some((file) => {
                const dotIndex = file.name.lastIndexOf(".");
                const extension = dotIndex > 0 ? file.name.substring(dotIndex + 1).toLowerCase() : "";
                return !acceptedExtensions.includes(extension);
            });

            if (hasInvalidFile) {
                this.selectedFiles = [];
                this.raiseError(`Only ${this.props.acceptedExtensions.map((ext) => `.${ext}`).join(", ")} files are allowed.`);
                this.clearSelection();
                return;
            }

            this.selectedFiles = files;
            this.clearError();
            onInput(files);
        });
    }

    public bootstrap(): void {
        this.attachInputHtml(this.props.placeholderId, this.props.label);
        this.attachInputListener(this.props.onInput);
    }

    public clearError(): void {
        const errorElement = this.getErrorDivElement();
        errorElement.textContent = "";
        errorElement.style.display = "none";
        const inputElement = this.getInputElement();
        inputElement.classList.remove("is-invalid");
    }

    public clearInput(): void {
        this.clearSelection();
    }

    public raiseError(errorMessage: string): void {
        const errorElement = this.getErrorDivElement();
        errorElement.textContent = errorMessage;
        errorElement.style.display = "block";
        const inputElement = this.getInputElement();
        inputElement.classList.add("is-invalid");
    }

    public validate(): boolean {
        const value = this.selectedFiles;

        if (this.validationFunction) {
            const error = this.validationFunction(value);
            if (error) {
                this.raiseError(error);
                return false;
            }
        }

        this.clearError();
        return true;
    }

    public getValue(): File[] {
        return this.selectedFiles;
    }
}
