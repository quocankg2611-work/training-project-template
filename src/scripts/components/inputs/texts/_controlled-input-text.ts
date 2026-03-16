import { HtmlUtils } from "../../../utilities/_html";
import { ControlledInputBase } from "../_controlled-input.base";
import { ControlledInputTextBase } from "./_controlled-input-text.base";

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

export class ControlledInput extends ControlledInputTextBase {
    constructor(
        private readonly props: ControlledInputProps,
        validationFunction?: (value: string) => string | null,
    ) {
        super(validationFunction);
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
}
