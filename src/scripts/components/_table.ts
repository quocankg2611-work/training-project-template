import { HomePageDocumentView } from "../pages/home/_home-page.types";
import { HtmlUtils } from "../utilities/_html";

export class TableComponent {
    constructor(
        private readonly onDocumentItemSelectionChanged: (selectedDocumentId: string, isSelected: boolean) => void,
        private readonly onFolderNavigated: (folderId: string) => void,
        private readonly onViewDetails?: (documentId: string) => void,
        private readonly onDownload?: (documentId: string) => void,
    ) { }

    public build(
        items: HomePageDocumentView[],
        selectedItemIds: string[],
    ): HTMLElement {
        const tableHtml = this.buildHtml(items, selectedItemIds);
        const tableElement = HtmlUtils.stringToSingleHtmlElement(tableHtml);

        // Attach selection event listeners
        for (const item of items) {
            const tableRowElement = tableElement.querySelector(`tr[data-id="${item.id}"]`);
            if (item.documentType === "folder") {
                tableRowElement?.addEventListener("click", () => {
                    this.onFolderNavigated(item.id);
                });
            }

            const rowActions = tableRowElement?.querySelector(".file-table__row-actions");
            rowActions?.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            const documentSelectionArea = tableRowElement?.querySelector(`td[data-id="${item.id}"]`);
            const selectionInput = documentSelectionArea?.querySelector<HTMLInputElement>(`input[data-id="${item.id}"]`);
            documentSelectionArea?.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent the click from bubbling up to the row's click event
                if (selectionInput && e.target !== selectionInput) {
                    selectionInput.click();
                }
            });

            selectionInput?.addEventListener("change", (e) => {
                e.stopPropagation();
                this.onDocumentItemSelectionChanged(item.id, selectionInput.checked);
            });
        }

        return tableElement;
    }

    private buildHtml(
        items: HomePageDocumentView[],
        selectedItemIds: string[],
    ): string {
        const html = `
        <div class="home-page__table">
            <div class="home-page__table-loading-container hidden">
                <div class="loader loader--spinner"></div>
            </div>

            <table class="file-table">
                <thead>
                    <th></th>
                    <th><span class="file-table__icon--file"></span></th>
                    <th>Name <span class="file-table__dropdown-indicator"></span></th>
                    <th>Modified <span class="file-table__dropdown-indicator"></span></th>
                    <th>Modified By <span class="file-table__dropdown-indicator"></span></th>
                    <th><span class="file-table__header-icon--add"></span> Add column</th>
                    </tr>
                </thead>

                <tbody>
                   ${items.map(item => this.buildRowHtml(item, selectedItemIds)).join("")}
                </tbody>
            </table>
        </div>
    `;

        return html;
    }

    private buildRowHtml(
        item: HomePageDocumentView,
        selectedItemIds: string[],
    ): string {
        const isSelected = selectedItemIds.includes(item.id);
        const html = `
        <tr data-id="${item.id}" class="file-table__row ${isSelected ? "file-table__row--selected" : ""}">
            <td data-id=${item.id}>
                <input class="form-check-input"
                        data-id="${item.id}"
                        type="checkbox"
                        ${isSelected ? "checked" : ""}
                        />
            </td>
            <td>
                <span class="file-table__icon--${item.documentType === "file"
                ? item.fileType ?? "unknown"
                : "folder"
            }"></span>
            </td>
            <td>
                <div class="file-table__name-cell">
                    <span class="file-table__name-text ${item.documentType === "file" ? "file-table__text-file" : ""}">${item.name}</span>
                    <div class="file-table__row-actions" aria-hidden="true">
                        <span class="file-table__row-action file-table__row-action--view" title="View details"></span>
                        <span class="file-table__row-action file-table__row-action--download" title="Download"></span>
                    </div>
                </div>
            </td>
            <td>
                ${item.modifiedTimeAgo}
            </td>
            <td>
                ${item.modifiedBy}
            </td>
            <td></td>
        </tr>
            `;

        return html;
    }
}
