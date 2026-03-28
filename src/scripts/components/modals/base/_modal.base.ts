import { Modal } from "bootstrap";

export type ModalConfig = {
    /**
     * Type of modal, used for classifying the modal in the HTML (e.g. "addFile", "editFile", etc.). Should be unique across all modals.
     */
    modalType: string;
    onModalShow?: () => void;
}

type ModalLayoutConfig = {
    footerHtml?: string;
}

export abstract class ModalBase {
    private readonly id: string;

    protected readonly bodyId: string;

    /**
     * For accessing bootstrap javascript methods
     */
    private modalInstance: Modal;
    /**
     * For accessing the HTML element of the modal
     */
    protected readonly modalElement: HTMLElement;

    protected constructor(
        private readonly modalConfig: ModalConfig,
        title: string,
        subtitle: string,
        layoutConfig?: ModalLayoutConfig,
    ) {
        this.id = `modal-${crypto.randomUUID()}`;
        this.bodyId = `${this.id}--body`;

        this.attachHtml(this.modalConfig.modalType, title, subtitle, layoutConfig?.footerHtml);
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
        });
        this.modalElement.addEventListener('show.bs.modal', () => {
            this.modalConfig.onModalShow?.();
        });
    }

    private attachHtml(
        modalType: string,
        title: string,
        subtitle: string,
        footerHtml?: string,
    ): void {
        const footerSection = footerHtml
            ? `<div class="modal-footer">${footerHtml}</div>`
            : "";
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
                        ${footerSection}
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