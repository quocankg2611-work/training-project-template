import { HtmlUtils } from "../../utilities/_html";

type ControlledInputProps = {
    label: string;
    /**
     * Placeholder text for the input field, not placeholderId which is the ID of the element that will be replaced by this input.
     */
    placeholder: string;
    maxLength: number;
    placeholderId: string;
    onInput?: (value: string) => void;
}

export class ControlledInput {
    private readonly id: string;
    private readonly errorId: string;
    private readonly inputId: string;

    constructor(
        private readonly props: ControlledInputProps,
        private readonly validationFunction?: (value: string) => string | null,
    ) {
        this.id = crypto.randomUUID();
        this.errorId = `${this.id}--error`;
        this.inputId = `${this.id}--input`;
    }

    private getInputElement(): HTMLInputElement {
        const inputElement = document.getElementById(this.inputId) as HTMLInputElement | null;
        if (!inputElement) {
            throw new Error(`Input element with ID '${this.inputId}' not found.`);
        }
        return inputElement;
    }

    private getErrorDivElement(): HTMLElement {
        const errorElement = document.getElementById(this.errorId);
        if (!errorElement) {
            throw new Error(`Error element with ID '${this.errorId}' not found.`);
        }
        return errorElement;
    }

    private attachInputHtml(
        placeholderId: string,
        label: string,
        placeholder: string,
        maxLength: number,
    ): void {
        const html = `
            <div id="${this.id}">
                <label for="${this.inputId}"
                    class="form-label">${label}</label>
                <input type="text"
                    class="form-control"
                    id="${this.inputId}"
                    placeholder="${placeholder}"
                    maxlength="${maxLength}"
                    autocomplete="off" />
                <div class="invalid-feedback"
                    id="${this.errorId}"></div>
            </div>
        `;
        const element = HtmlUtils.stringToSingleHtmlElement(html);
        HtmlUtils.replaceElementWithHtml(placeholderId, element);
    }

    private attachInputListener(onInput?: (value: string) => void): void {
        if (!onInput) return;
        const inputElement = this.getInputElement();
        inputElement.addEventListener("input", () => {
            onInput(inputElement.value);
        });
    }

    public bootstrap(): void {
        this.attachInputHtml(this.props.placeholderId, this.props.label, this.props.placeholder, this.props.maxLength);
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
        const inputElement = this.getInputElement();
        inputElement.value = "";
    }

    public raiseError(errorMessage: string): void {
        const errorElement = this.getErrorDivElement();
        errorElement.textContent = errorMessage;
        errorElement.style.display = "block";
        const inputElement = this.getInputElement();
        inputElement.classList.add("is-invalid");
    }

    public validate(): boolean {
        const inputElement = this.getInputElement();
        const value = inputElement.value;

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

    public getValue(): string {
        return this.getInputElement().value?.trim() || "";
    }
}
