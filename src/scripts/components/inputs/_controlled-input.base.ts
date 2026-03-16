export abstract class ControlledInputBase {
    protected readonly id: string;
    protected readonly errorId: string;
    protected readonly inputId: string;

    protected constructor() {
        this.id = crypto.randomUUID();
        this.errorId = `${this.id}--error`;
        this.inputId = `${this.id}--input`;
    }

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
}