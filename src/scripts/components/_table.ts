import { HomePageDocumentView } from "../pages/home/_home-page.types";
import { stringToHtmlElement } from "../utilities/_strings";

export class TableComponent {
    constructor(
        private readonly onDocumentItemSelected: (selectedDocumentId: string | null) => void,
        private readonly onFolderNavigated: (folderId: string) => void,
    ) { }

    public build(
        items: HomePageDocumentView[],
        selectedItemId: string | null,
    ): HTMLElement {
        const tableHtml = this.buildHtml(items, selectedItemId);
        const tableElement = stringToHtmlElement(tableHtml);

        // Attach selection event listeners
        for (const item of items) {
            const tableRowElement = tableElement.querySelector(`tr[data-id="${item.id}"]`);
            if (item.documentType === "folder") {
                tableRowElement?.addEventListener("click", () => {
                    this.onFolderNavigated(item.id);
                });
            }

            const documentSelectionArea = tableRowElement.querySelector(`td[data-id="${item.id}"]`);
            documentSelectionArea?.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent the click from bubbling up to the row's click event
                this.onDocumentItemSelected(item.id);
            });
        }

        return tableElement;
    }

    private buildHtml(
        items: HomePageDocumentView[],
        selectedItemId: string | null,
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
                   ${items.map(item => this.buildRowHtml(item, selectedItemId)).join("")}
                </tbody>
            </table>
        </div>
    `;

        return html;
    }

    private buildRowHtml(
        item: HomePageDocumentView,
        selectedItemId: string | null,
    ): string {
        const html = `
        <tr data-id="${item.id}" class="file-table__row ${item.id === selectedItemId ? "file-table__row--selected" : ""}">
            <td data-id=${item.id}>
                <input class="form-check-input"
                        type="radio"
                        name="file-table-select"
                        ${item.id === selectedItemId ? "checked" : ""}
                        />
            </td>
            <td>
                <span class="file-table__icon--${item.documentType === "file" 
                    ? item.fileType ?? "unknown"
                    : "folder"
                }"></span>
            </td>
            <td>
                <span class="${item.documentType === "file" ? "file-table__text-file" : ""}">${item.name}</span>
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
