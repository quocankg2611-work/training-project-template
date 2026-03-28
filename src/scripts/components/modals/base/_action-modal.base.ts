import { ModalBase, ModalConfig } from "./_modal.base";

type ActionModalConfig = ModalConfig & {
    onModalConfirmed?: () => void;
}

export abstract class ActionModalBase extends ModalBase {
    private readonly submitBtnId: string;
    private readonly globalErrorId: string;

    protected constructor(
        private readonly actionModalConfig: ActionModalConfig,
        title: string,
        subtitle: string,
        confirmText: string,
    ) {
        const submitBtnId = `modal-submit-${crypto.randomUUID()}`;
        const globalErrorId = `modal-error-${crypto.randomUUID()}`;

        super(actionModalConfig, title, subtitle, {
            footerHtml: ActionModalBase.getFooterHtml(globalErrorId, submitBtnId, confirmText),
        });

        this.submitBtnId = submitBtnId;
        this.globalErrorId = globalErrorId;

        this.modalElement.addEventListener('hide.bs.modal', () => {
            this.raiseGlobalError(null);
        });
        const submitBtn = document.getElementById(this.submitBtnId);
        submitBtn?.addEventListener("click", () => {
            this.actionModalConfig.onModalConfirmed?.();
        });

    }

    protected raiseGlobalError(message: string | null): void {
        if (this.modalElement) {
            const errorDiv = this.modalElement.querySelector(`#${this.globalErrorId}`) as HTMLDivElement;
            if (errorDiv) {
                errorDiv.textContent = message ?? "";
                errorDiv.style.display = message ? "block" : "none";
            }
        }
    }

    private static getFooterHtml(
        globalErrorId: string,
        submitBtnId: string,
        confirmText: string,
    ): string {
        return `
            <div id="${globalErrorId}" class="text-danger" style="display:none;"></div>
            <button class="btn-cancel" data-bs-dismiss="modal">Cancel</button>
            <button class="btn-add" id="${submitBtnId}">${confirmText}</button>
        `;
    }
}