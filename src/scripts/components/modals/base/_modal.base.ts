import { Modal } from "bootstrap";

export abstract class ModalBase {
    private readonly modalId: string;
    private readonly modalSubmitBtnId: string;
    private readonly modalGlobalErrorId: string;

    private readonly title: string;
    private readonly subtitle: string;
    private readonly confirmText: string;

    /**
     * For accessing bootstrap javascript methods
     */
    private modalInstance: Modal | null;
    /**
     * For accessing the HTML element of the modal
     */
    private modalElement: HTMLElement | null;

    constructor(
        title: string,
        subtitle: string,
        confirmText: string,
    ) {
        this.modalId = `modal-${Math.random().toString(36).slice(2, 9)}`;
        this.modalSubmitBtnId = `${this.modalId}--submitBtn`;
        this.modalGlobalErrorId = `${this.modalId}--globalError`;

        this.modalElement = null;
        this.modalInstance = null;
        this.title = title;
        this.subtitle = subtitle;
        this.confirmText = confirmText;
    }

    public bootstrap(): this {
        this.modalElement = this.buildAndRender(this.title, this.subtitle, this.confirmText);
        this.modalInstance = new Modal(this.modalElement);
        this.modalElement.addEventListener('hide.bs.modal', () => {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
                active.blur();
            }
            this.raiseGlobalError(null);
        });
        this.onAfterRender();
        return this;
    }

    private resetGlobalError(): void {
        const errorDiv = this.modalElement.querySelector(`#${this.modalGlobalErrorId}`) as HTMLDivElement;
        if (errorDiv) {
            errorDiv.textContent = "";
            errorDiv.style.display = "none";
        }
    }

    protected raiseGlobalError(message: string): void {
        if (this.modalElement) {
            const errorDiv = this.modalElement.querySelector(`#${this.modalGlobalErrorId}`) as HTMLDivElement;
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = "block";
            }
        }
    }

    protected getModalSubmitBtn(): HTMLButtonElement {
        const submitBtn = document.getElementById(this.modalSubmitBtnId) as HTMLButtonElement;
        if (!submitBtn) {
            throw new Error(`Submit button with ID ${this.modalSubmitBtnId} not found.`);
        }
        return submitBtn;
    }

    protected getModalId(): string {
        return this.modalId;
    }

    protected getModalElement(): HTMLElement {
        return this.modalElement;
    }

    private buildAndRender(
        title: string,
        subtitle: string,
        confirmText: string,
    ): HTMLElement {
        const html = `
            <div class="modal fade" id="${this.modalId}" data-name="${this.getModalName()}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" style="max-width:420px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title-group">
                                <div>
                                    <div class="modal-title">${title}</div>
                                    <div class="modal-subtitle">${subtitle}</div>
                                </div>
                            </div>
                            <button class="btn-close-modal" data-bs-dismiss="modal">✕</button>
                        </div>
                        <div class="modal-body">${this.buildBodyHtml()}</div>
                        <div class="modal-footer">
                            <div id="${this.modalGlobalErrorId}" class="text-danger"></div>
                            <button class="btn-cancel" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn-add" id="${this.modalSubmitBtnId}">${confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        const element = document.getElementById(this.modalId);
        return element;
    }

    /**
     * Used for classifying the modal type in the HTML
     */
    protected abstract getModalName(): string;

    protected abstract buildBodyHtml(): string;

    // ======================================
    // Life cycle
    // ======================================

    /**
     * For assigning events
     */
    protected abstract onAfterRender(): void;

    public show(): void {
        this.modalInstance?.show();
    }

    public hide(): void {
        this.modalInstance?.hide();
    }
}