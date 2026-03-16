import { ControlledInputBase } from "../_controlled-input.base";

export abstract class ControlledInputTextBase extends ControlledInputBase {
    protected constructor(
        private readonly validationFunction?: (value: string) => string | null,
    ) { super(); }

    protected getInputElement(): HTMLInputElement {
        const inputElement = document.getElementById(this.inputId) as HTMLInputElement | null;
        if (!inputElement) {
            throw new Error(`Input element with ID '${this.inputId}' not found.`);
        }
        return inputElement;
    }

    protected getErrorDivElement(): HTMLElement {
        const errorElement = document.getElementById(this.errorId);
        if (!errorElement) {
            throw new Error(`Error element with ID '${this.errorId}' not found.`);
        }
        return errorElement;
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

    public setInputValue(value: string): void {
        const inputElement = this.getInputElement();
        inputElement.value = value;
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