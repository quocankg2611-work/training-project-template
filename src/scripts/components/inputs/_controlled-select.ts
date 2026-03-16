import { HtmlUtils } from "../../utilities/_html";

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

export class ControlledSelect {
    private readonly id: string;
    private readonly errorId: string;
    private readonly selectId: string;

    constructor(
        private readonly props: ControlledSelectProps,
        private readonly validationFunction?: (value: string) => string | null,
    ) {
        this.id = crypto.randomUUID();
        this.errorId = `${this.id}--error`;
        this.selectId = `${this.id}--input`;
    }

    private getSelectElement(): HTMLSelectElement {
        const selectElement = document.getElementById(this.selectId) as HTMLSelectElement | null;
        if (!selectElement) {
            throw new Error(`Select element with ID '${this.selectId}' not found.`);
        }
        return selectElement;
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
    ): void {
        const html = `
            <div id="${this.id}">
                <label for="${this.selectId}"
                    class="form-label mt-3">${label}</label>
                <select class="form-select"
                    id="${this.selectId}">
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
        const selectElement = this.getSelectElement();
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
        const selectElement = this.getSelectElement();
        selectElement.classList.remove("is-invalid");
    }

    public clearInput(): void {
        const selectElement = this.getSelectElement();
        selectElement.value = "";
    }

    public raiseError(errorMessage: string): void {
        const errorElement = this.getErrorDivElement();
        errorElement.textContent = errorMessage;
        errorElement.style.display = "block";
        const selectElement = this.getSelectElement();
        selectElement.classList.add("is-invalid");
    }

    public validate(): boolean {
        const selectElement = this.getSelectElement();
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
        return this.getSelectElement().value?.trim() || "";
    }
}
