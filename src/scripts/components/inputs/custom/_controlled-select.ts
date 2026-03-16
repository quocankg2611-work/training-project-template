import { HtmlUtils } from "../../../utilities/_html";
import { ControlledInputBase } from "../_controlled-input.base";

type ControlledSelectProps = {
    label: string;
    /**
     * Placeholder text for the input field, not placeholderId which is the ID of the element that will be replaced by this input.
     */
    placeholder: string;
    placeholderId: string;
    valueTextPairs: { value: string, text: string }[];
    onSelect?: (value: string) => void;
}

export class ControlledSelect extends ControlledInputBase {
    constructor(
        private readonly props: ControlledSelectProps,
        private readonly validationFunction?: (value: string) => string | null,
    ) { super(); }

    private attachInputHtml(
        placeholderId: string,
        label: string,
        placeholder: string,
    ): void {
        const html = `
            <div id="${this.id}">
                <label for="${this.inputId}"
                    class="form-label mt-3">${label}</label>
                <select class="form-select"
                    id="${this.inputId}">
                    <option value="" disabled selected>${placeholder}</option>
                    ${this.props.valueTextPairs.map(pair => `<option value="${pair.value}">${pair.text}</option>`).join("")}
                </select>
                <div class="invalid-feedback"
                    id="${this.errorId}"></div>
            </div>
        `;
        const element = HtmlUtils.stringToSingleHtmlElement(html);
        HtmlUtils.replaceElementWithHtml(placeholderId, element);
    }

    private attachSelectListener(onSelect?: (value: string) => void): void {
        if (!onSelect) return;
        const selectElement = this.getInputElement();
        selectElement.addEventListener("change", () => {
            onSelect(selectElement.value);
        });
    }

    public bootstrap(): void {
        this.attachInputHtml(this.props.placeholderId, this.props.label, this.props.placeholder);
        this.attachSelectListener(this.props.onSelect);
    }

    public clearError(): void {
        const errorElement = this.getErrorDivElement();
        errorElement.textContent = "";
        errorElement.style.display = "none";
        const selectElement = this.getInputElement();
        selectElement.classList.remove("is-invalid");
    }

    public clearInput(): void {
        const selectElement = this.getInputElement();
        selectElement.value = "";
    }

    public raiseError(errorMessage: string): void {
        const errorElement = this.getErrorDivElement();
        errorElement.textContent = errorMessage;
        errorElement.style.display = "block";
        const selectElement = this.getInputElement();
        selectElement.classList.add("is-invalid");
    }

    public validate(): boolean {
        const selectElement = this.getInputElement();
        const value = selectElement.value;

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
