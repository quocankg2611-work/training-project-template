import bootstrap from "bootstrap";

export abstract class ModalBase {
    protected readonly modalId: string;

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
        this.modalId = `modal-${this.getModalIdPrefix()}-${Math.random().toString(36).slice(2, 9)}`;
        this.modalElement = this.buildElement(title, subtitle, confirmText);
        this.modalInstance = new bootstrap.Modal(this.modalElement);
        this.onAfterRender();
    }

    protected getModalSubmitBtnId(): string {
        return `${this.modalId}--submitBtn`;
    }

    private buildElement(
        title: string,
        subtitle: string,
        confirmText: string,
    ): HTMLElement {
        const html = `
            <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true">
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
                            <button class="btn-add" id="${this.getModalSubmitBtnId()}--">${confirmText}</button>
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

    protected abstract getModalIdPrefix(): string;

    protected abstract buildBodyHtml(): string;

    /**
     * For assigning events
     */
    protected abstract onAfterRender(): void;

    show(): void {
        this.modalInstance.show();
    }

    hide(): void {
        this.modalInstance.hide();
    }
}