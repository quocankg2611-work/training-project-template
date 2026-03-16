import { HtmlUtils } from "../utilities/_html";

export type UploadPanelItemStatus = "uploading" | "completed" | "failed";

type UploadPanelItem = {
    id: string;
    fileName: string;
    fileSize: number;
    progress: number;
    status: UploadPanelItemStatus;
    errorMessage: string | null;
};

export class UploadPanelComponent {
    private readonly panelElement: HTMLElement;
    private readonly bodyElement: HTMLElement;
    private readonly emptyElement: HTMLElement;
    private readonly uploadItemsById: Record<string, UploadPanelItem> = {};

    constructor() {
        this.panelElement = this.buildPanelElement();
        this.bodyElement = this.panelElement.querySelector(".upload-panel__body") as HTMLElement;
        this.emptyElement = this.panelElement.querySelector(".upload-panel__empty") as HTMLElement;

        const closeButton = this.panelElement.querySelector(".upload-panel__close") as HTMLButtonElement;
        closeButton.addEventListener("click", () => {
            this.hide();
        });

        this.toggleEmptyState();
    }

    public mount(parentElement: HTMLElement = document.body): void {
        if (!this.panelElement.parentElement) {
            parentElement.appendChild(this.panelElement);
        }
    }

    public show(): void {
        this.panelElement.classList.remove("hidden");
    }

    public hide(): void {
        this.panelElement.classList.add("hidden");
    }

    public startUpload(file: File): string {
        const uploadId = crypto.randomUUID();
        this.uploadItemsById[uploadId] = {
            id: uploadId,
            fileName: file.name,
            fileSize: file.size,
            progress: 0,
            status: "uploading",
            errorMessage: null,
        };

        this.renderOrUpdateItem(uploadId);
        this.show();
        return uploadId;
    }

    public updateProgress(uploadId: string, progress: number): void {
        const uploadItem = this.uploadItemsById[uploadId];
        if (!uploadItem) {
            return;
        }

        uploadItem.progress = this.clampProgress(progress);
        uploadItem.status = uploadItem.progress >= 100 ? "completed" : "uploading";
        if (uploadItem.status === "completed") {
            uploadItem.errorMessage = null;
        }

        this.renderOrUpdateItem(uploadId);
    }

    public markCompleted(uploadId: string): void {
        const uploadItem = this.uploadItemsById[uploadId];
        if (!uploadItem) {
            return;
        }

        uploadItem.progress = 100;
        uploadItem.status = "completed";
        uploadItem.errorMessage = null;

        this.renderOrUpdateItem(uploadId);
    }

    public markFailed(uploadId: string, errorMessage = "Upload failed"): void {
        const uploadItem = this.uploadItemsById[uploadId];
        if (!uploadItem) {
            return;
        }

        uploadItem.status = "failed";
        uploadItem.errorMessage = errorMessage;

        this.renderOrUpdateItem(uploadId);
        this.show();
    }

    public removeUpload(uploadId: string): void {
        if (!this.uploadItemsById[uploadId]) {
            return;
        }

        delete this.uploadItemsById[uploadId];
        const rowElement = this.bodyElement.querySelector(`[data-upload-id="${uploadId}"]`);
        rowElement?.remove();

        this.toggleEmptyState();
    }

    public clear(): void {
        for (const id of Object.keys(this.uploadItemsById)) {
            delete this.uploadItemsById[id];
        }
        this.bodyElement.innerHTML = "";
        this.toggleEmptyState();
    }

    private buildPanelElement(): HTMLElement {
        const html = `
            <section class="upload-panel hidden" aria-live="polite" aria-label="File upload progress">
                <div class="upload-panel__header d-flex align-items-center justify-content-between mb-2">
                    <strong>Uploads</strong>
                    <button type="button" class="btn btn-sm btn-outline-secondary upload-panel__close">Close</button>
                </div>
                <div class="upload-panel__empty text-secondary small">No active uploads</div>
                <div class="upload-panel__body d-flex flex-column gap-2"></div>
            </section>
        `;

        return HtmlUtils.stringToSingleHtmlElement(html);
    }

    private renderOrUpdateItem(uploadId: string): void {
        const uploadItem = this.uploadItemsById[uploadId];
        if (!uploadItem) {
            return;
        }

        const existingElement = this.bodyElement.querySelector(`[data-upload-id="${uploadId}"]`) as HTMLElement | null;
        const nextElement = HtmlUtils.stringToSingleHtmlElement(this.buildItemHtml(uploadItem));
        if (existingElement) {
            existingElement.replaceWith(nextElement);
        } else {
            this.bodyElement.appendChild(nextElement);
        }

        const removeButton = nextElement.querySelector(".upload-panel__item-remove") as HTMLButtonElement;
        removeButton.addEventListener("click", () => {
            this.removeUpload(uploadId);
        });

        this.toggleEmptyState();
    }

    private buildItemHtml(uploadItem: UploadPanelItem): string {
        const statusClassName = uploadItem.status === "failed"
            ? "text-danger"
            : uploadItem.status === "completed"
                ? "text-success"
                : "text-secondary";

        const statusText = uploadItem.status === "failed"
            ? (uploadItem.errorMessage ?? "Upload failed")
            : uploadItem.status === "completed"
                ? "Completed"
                : `Uploading ${uploadItem.progress}%`;

        const progressBarClass = uploadItem.status === "failed" ? "bg-danger" : "bg-success";

        return `
            <article class="upload-panel__item" data-upload-id="${uploadItem.id}">
                <div class="d-flex justify-content-between align-items-start gap-2">
                    <div class="d-flex flex-column">
                        <span class="small fw-semibold">${uploadItem.fileName}</span>
                        <span class="small ${statusClassName}">${statusText}</span>
                    </div>
                    <button type="button" class="btn-close upload-panel__item-remove" aria-label="Remove upload"></button>
                </div>
                <div class="small text-secondary mb-1">${this.formatFileSize(uploadItem.fileSize)}</div>
                <div class="progress" role="progressbar" aria-valuenow="${uploadItem.progress}" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar ${progressBarClass}" style="width: ${uploadItem.progress}%"></div>
                </div>
            </article>
        `;
    }

    private toggleEmptyState(): void {
        const uploadCount = Object.keys(this.uploadItemsById).length;
        this.emptyElement.classList.toggle("hidden", uploadCount > 0);
        if (uploadCount === 0) {
            this.hide();
        }
    }

    private clampProgress(progress: number): number {
        if (Number.isNaN(progress)) {
            return 0;
        }
        return Math.max(0, Math.min(100, Math.floor(progress)));
    }

    private formatFileSize(sizeInBytes: number): string {
        if (sizeInBytes < 1024) {
            return `${sizeInBytes} B`;
        }

        const sizeInKb = sizeInBytes / 1024;
        if (sizeInKb < 1024) {
            return `${sizeInKb.toFixed(1)} KB`;
        }

        const sizeInMb = sizeInKb / 1024;
        return `${sizeInMb.toFixed(1)} MB`;
    }
}