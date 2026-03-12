import { Modal } from "bootstrap";

export abstract class ModalBase {
    private readonly modalId: string;
    private readonly modalSubmitBtnId: string;

    /**
     * For accessing bootstrap javascript methods
     */
    private readonly modalInstance: bootstrap.Modal;
    /**
     * For accessing the HTML element of the modal
     */
    private readonly modalElement: HTMLElement;

    constructor(
        title: string,
        subtitle: string,
        confirmText: string,
    ) {
        this.modalId = `modal-${Math.random().toString(36).slice(2, 9)}`;
        this.modalSubmitBtnId = `${this.modalId}--submitBtn`;
        this.modalElement = this.buildAndRender(title, subtitle, confirmText);
        this.modalInstance = new Modal(this.modalElement);
        this.onAfterRender();
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
                            <button class="btn-cancel" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn-add" id="${this.modalSubmitBtnId}">${confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
        const element = document.getElementById(this.modalId);
        element.addEventListener('hidden.bs.modal', () => {
            this.modalInstance?.dispose();
            this.modalElement?.remove();
        });
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
        this.modalInstance.show();
    }

    public hide(): void {
        this.modalInstance.hide();
    }
}