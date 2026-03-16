import { Modal } from "bootstrap";

type ModalConfig = {
    /**
     * Type of modal, used for classifying the modal in the HTML (e.g. "addFile", "editFile", etc.). Should be unique across all modals.
     */
    modalType: string;
    onModalShow?: () => void;
    onModalConfirmed?: () => void;
}

export abstract class ModalBase2 {
    private readonly id: string;
    private readonly submitBtnId: string;
    private readonly globalErrorId: string;

    protected readonly bodyId: string;

    /**
     * For accessing bootstrap javascript methods
     */
    private modalInstance: Modal;
    /**
     * For accessing the HTML element of the modal
     */
    private modalElement: HTMLElement;

    protected constructor(
        private readonly modalConfig: ModalConfig,
        title: string,
        subtitle: string,
        confirmText: string,
    ) {
        this.id = `modal-${crypto.randomUUID()}`;
        this.submitBtnId = `${this.id}--submitBtn`;
        this.globalErrorId = `${this.id}--globalError`;
        this.bodyId = `${this.id}--body`;

        this.attachHtml(this.modalConfig.modalType, title, subtitle, confirmText);
        const modalEl = document.getElementById(this.id);
        if (!modalEl) {
            throw new Error("Failed to find modal element after attaching HTML");
        }
        this.modalElement = modalEl;
        this.modalInstance = new Modal(this.modalElement);
        this.modalElement.addEventListener('hide.bs.modal', () => {
            const active = document.activeElement;
            if (active instanceof HTMLElement) {
                active.blur();
            }
            this.raiseGlobalError(null);
        });
        this.modalElement.addEventListener('show.bs.modal', () => {
            this.modalConfig.onModalShow?.();
        });
        const submitBtn = document.getElementById(this.submitBtnId);
        submitBtn?.addEventListener("click", () => {
            this.modalConfig.onModalConfirmed?.();
        });

    }

    protected raiseGlobalError(message: string): void {
        if (this.modalElement) {
            const errorDiv = this.modalElement.querySelector(`#${this.globalErrorId}`) as HTMLDivElement;
            if (errorDiv) {
                errorDiv.textContent = message;
                errorDiv.style.display = "block";
            }
        }
    }

    private attachHtml(
        modalType: string,
        title: string,
        subtitle: string,
        confirmText: string,
    ): void {
        const html = `
            <div class="modal fade" id="${this.id}" data-name="${modalType}" tabindex="-1" aria-hidden="true">
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
                        <div id="${this.bodyId}" class="modal-body"></div>
                        <div class="modal-footer">
                            <div id="${this.globalErrorId}" class="text-danger"></div>
                            <button class="btn-cancel" data-bs-dismiss="modal">Cancel</button>
                            <button class="btn-add" id="${this.submitBtnId}">${confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    public show(): void {
        this.modalInstance.show();
    }

    public hide(): void {
        this.modalInstance.hide();
    }
}