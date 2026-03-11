import bootstrap from "bootstrap";

interface IModal {
    title: string;
    subtitle: string;
    modalId: string;
    modalInstance: bootstrap.Modal | null;
    element: HTMLElement | null;
}

export abstract class BaseModal {
    title: string;
    subtitle: string;
    modalId: string;
    modalInstance: bootstrap.Modal | null;
    element: HTMLElement | null;

    constructor(
        title: string,
        subtitle: string
    ) {
        this.title = title;
        this.subtitle = subtitle;
        this.modalId = `modal-${Math.random().toString(36).slice(2, 9)}`;
        this.modalInstance = null;
        this.element = null;
    }

    getBodyHtml(): string {
        return '';
    }

    getFooterHtml(): string {
        return `
        <button class="btn-cancel" data-bs-dismiss="modal">Cancel</button>
        <button class="btn-add" id="${this.modalId}--submitBtn">Confirm</button>
        `;
    }

    onAfterRender(): void { }

    create(): this {
        const html = `
            <div class="modal fade" id="${this.modalId}" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" style="max-width:420px;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <div class="modal-title-group">
                                <div>
                                    <div class="modal-title">${this.title}</div>
                                    <div class="modal-subtitle">${this.subtitle}</div>
                                </div>
                            </div>
                            <button class="btn-close-modal" data-bs-dismiss="modal">✕</button>
                        </div>
                        <div class="modal-body">${this.getBodyHtml()}</div>
                        <div class="modal-footer">${this.getFooterHtml()}</div>
                    </div>
                </div>
            </div>
      `;

        document.body.insertAdjacentHTML('beforeend', html);
        this.element = document.getElementById(this.modalId);
        this.modalInstance = new bootstrap.Modal(this.element!);

        this.element!.addEventListener('hidden.bs.modal', () => {
            this.modalInstance?.dispose();
            this.element?.remove();
        });

        this.onAfterRender();
        return this;
    }

    show(): void {
        if (!this.element) this.create();
        this.modalInstance?.show();
    }

    hide(): void {
        this.modalInstance?.hide();
    }
}