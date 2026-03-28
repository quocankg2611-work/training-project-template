import { FolderModel } from "../../../models/_folder.model";
import { ModalBase } from "../base/_modal.base";

export class FolderDetailModalComponent extends ModalBase {
    private readonly idValueId: string;
    private readonly nameValueId: string;
    private readonly pathValueId: string;
    private readonly createdAtValueId: string;
    private readonly createdByValueId: string;
    private readonly updatedAtValueId: string;
    private readonly updatedByValueId: string;

    constructor() {
        super(
            {
                modalType: "folderDetail",
            },
            "Folder Details",
            "View metadata of the selected folder.",
            {
                footerHtml: `<button class="btn-cancel" data-bs-dismiss="modal">Close</button>`,
            }
        );

        this.idValueId = `${this.bodyId}--id`;
        this.nameValueId = `${this.bodyId}--name`;
        this.pathValueId = `${this.bodyId}--path`;
        this.createdAtValueId = `${this.bodyId}--createdAt`;
        this.createdByValueId = `${this.bodyId}--createdBy`;
        this.updatedAtValueId = `${this.bodyId}--updatedAt`;
        this.updatedByValueId = `${this.bodyId}--updatedBy`;

        const body = document.getElementById(this.bodyId);
        if (!body) {
            throw new Error("Failed to find folder detail modal body element.");
        }

        body.innerHTML = `
			<div class="d-flex flex-column gap-2">
				${this.createRowHtml("Name", this.nameValueId)}
				${this.createRowHtml("Path", this.pathValueId)}
				${this.createRowHtml("Created At", this.createdAtValueId)}
				${this.createRowHtml("Created By", this.createdByValueId)}
				${this.createRowHtml("Updated At", this.updatedAtValueId)}
				${this.createRowHtml("Updated By", this.updatedByValueId)}
			</div>
		`;
    }

    public showWithData(folder: FolderModel): void {
        this.setValue(this.idValueId, folder.id);
        this.setValue(this.nameValueId, folder.name);
        this.setValue(this.pathValueId, folder.path);
        this.setValue(this.createdAtValueId, this.formatDate(folder.createdAt));
        this.setValue(this.createdByValueId, folder.createdByName);
        this.setValue(this.updatedAtValueId, this.formatDate(folder.updatedAt));
        this.setValue(this.updatedByValueId, folder.updatedByName);

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
}