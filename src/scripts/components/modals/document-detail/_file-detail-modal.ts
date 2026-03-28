import { FileModel } from "../../../models/_file.model";
import { ModalBase } from "../base/_modal.base";

export class FileDetailModalComponent extends ModalBase {
    private readonly idValueId: string;
    private readonly nameValueId: string;
    private readonly extensionValueId: string;
    private readonly sizeValueId: string;
    private readonly pathValueId: string;
    private readonly createdAtValueId: string;
    private readonly createdByValueId: string;
    private readonly updatedAtValueId: string;
    private readonly updatedByValueId: string;

    constructor() {
        super(
            {
                modalType: "fileDetail",
            },
            "File Details",
            "View metadata of the selected file.",
            {
                footerHtml: `<button class="btn-cancel" data-bs-dismiss="modal">Close</button>`,
            }
        );

        this.idValueId = `${this.bodyId}--id`;
        this.nameValueId = `${this.bodyId}--name`;
        this.extensionValueId = `${this.bodyId}--extension`;
        this.sizeValueId = `${this.bodyId}--size`;
        this.pathValueId = `${this.bodyId}--path`;
        this.createdAtValueId = `${this.bodyId}--createdAt`;
        this.createdByValueId = `${this.bodyId}--createdBy`;
        this.updatedAtValueId = `${this.bodyId}--updatedAt`;
        this.updatedByValueId = `${this.bodyId}--updatedBy`;

        const body = document.getElementById(this.bodyId);
        if (!body) {
            throw new Error("Failed to find file detail modal body element.");
        }

        body.innerHTML = `
			<div class="d-flex flex-column gap-2">
				${this.createRowHtml("Name", this.nameValueId)}
				${this.createRowHtml("Extension", this.extensionValueId)}
				${this.createRowHtml("Size", this.sizeValueId)}
				${this.createRowHtml("Path", this.pathValueId)}
				${this.createRowHtml("Created At", this.createdAtValueId)}
				${this.createRowHtml("Created By", this.createdByValueId)}
				${this.createRowHtml("Updated At", this.updatedAtValueId)}
				${this.createRowHtml("Updated By", this.updatedByValueId)}
			</div>
		`;
    }

    public showWithData(file: FileModel): void {
        this.setValue(this.idValueId, file.id);
        this.setValue(this.nameValueId, file.name);
        this.setValue(this.extensionValueId, file.extension);
        this.setValue(this.sizeValueId, this.formatBytes(file.sizeBytes));
        this.setValue(this.pathValueId, file.path);
        this.setValue(this.createdAtValueId, this.formatDate(file.createdAt));
        this.setValue(this.createdByValueId, file.createdByName);
        this.setValue(this.updatedAtValueId, this.formatDate(file.updatedAt));
        this.setValue(this.updatedByValueId, file.updatedByName);

        this.show();
    }

    private createRowHtml(label: string, valueId: string): string {
        return `
			<div class="d-flex justify-content-between align-items-start gap-3 border-bottom pb-2">
				<div class="text-muted small">${label}</div>
				<div id="${valueId}" class="fw-semibold text-end" style="word-break: break-word;"></div>
			</div>
		`;
    }

    private setValue(elementId: string, value: string | null | undefined): void {
        const element = document.getElementById(elementId);
        if (!element) {
            return;
        }
        element.textContent = value && value.trim() !== "" ? value : "-";
    }

    private formatDate(dateValue: string): string {
        if (!dateValue || dateValue.trim() === "") {
            return "-";
        }
        const date = new Date(dateValue);
        if (Number.isNaN(date.getTime())) {
            return "-";
        }
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    private formatBytes(sizeBytes: number): string {
        if (!Number.isFinite(sizeBytes) || sizeBytes < 0) {
            return "-";
        }
        if (sizeBytes === 0) {
            return "0 B";
        }

        const units = ["B", "KB", "MB", "GB", "TB"];
        const unitIndex = Math.min(Math.floor(Math.log(sizeBytes) / Math.log(1024)), units.length - 1);
        const normalized = sizeBytes / (1024 ** unitIndex);
        const formatted = normalized >= 100 ? normalized.toFixed(0) : normalized.toFixed(2);
        return `${formatted} ${units[unitIndex]}`;
    }
}