import { HomePageDocumentView } from "../pages/home/_home-page.types";
import { HtmlUtils } from "../utilities/_html";

export class CardListComponent {
    constructor(
        private readonly onDocumentItemSelectionChanged: (selectedDocumentId: string, isSelected: boolean) => void,
        private readonly onFolderNavigated: (folderId: string) => void,
        private readonly onViewDetails?: (documentId: string) => void,
        private readonly onDownload?: (documentId: string) => void,
    ) { }

    public build(
        documentItemViews: HomePageDocumentView[],
        selectedItemIds: string[],
    ): HTMLElement {
        const cardListHtml = this.buildHtml(documentItemViews, selectedItemIds);
        const cardListElement = HtmlUtils.stringToSingleHtmlElement(cardListHtml);

        // Attach selection event listeners
        for (const documentView of documentItemViews) {
            const cardElement = cardListElement.querySelector(`table[data-id="${documentView.id}"]`);
            if (documentView.documentType === "folder") {
                cardElement?.addEventListener("click", () => {
                    this.onFolderNavigated(documentView.id);
                });
            }

            const selectionArea = cardElement?.querySelector(`thead>tr>th:first-child`);
            const selectionInput = cardElement?.querySelector<HTMLInputElement>(`input[data-id="${documentView.id}"]`);
            selectionArea?.addEventListener("click", (event) => {
                event.stopPropagation(); // Prevent the click from bubbling up to the card's click event
                if (selectionInput && event.target !== selectionInput) {
                    selectionInput.click();
                }
            });

            selectionInput?.addEventListener("change", (event) => {
                event.stopPropagation();
                this.onDocumentItemSelectionChanged(documentView.id, selectionInput.checked);
            });

            const rowActions = cardElement?.querySelector(".file-table__row-actions");
            rowActions?.addEventListener("click", (event) => {
                event.stopPropagation();
            });

            const viewAction = rowActions?.querySelector<HTMLElement>(".file-table__row-action--view");
            viewAction?.addEventListener("click", (event) => {
                event.stopPropagation();
                this.onViewDetails?.(documentView.id);
            });
            viewAction?.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    this.onViewDetails?.(documentView.id);
                }
            });

            const downloadAction = rowActions?.querySelector<HTMLElement>(".file-table__row-action--download");
            downloadAction?.addEventListener("click", (event) => {
                event.stopPropagation();
                this.onDownload?.(documentView.id);
            });
            downloadAction?.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.stopPropagation();
                    this.onDownload?.(documentView.id);
                }
            });
        }

        return cardListElement;
    }

    private buildHtml(
        documentItemViews: HomePageDocumentView[],
        selectedItemIds: string[],
    ): string {
        const html = `
    	<div class="home-page__list d-flex flex-column flex-grow-1">
            <div class="home-page__list-loading-container hidden">
                <div class="loader loader--spinner"></div>
            </div>

            <div class="d-flex flex-column gap-4 pb-5">
                ${documentItemViews.map((view) => this.buildCardItem(view, selectedItemIds)).join("")}
            </div>
        </div>
    `;
        return html;
    }

    private buildCardItem(
        documentView: HomePageDocumentView,
        selectedItemIds: string[],
    ): string {
        const isSelected = selectedItemIds.includes(documentView.id);
        return `
        <table 
            class="file-card ${isSelected ? "file-card--selected" : ""}" 
            data-id="${documentView.id}"
        >
            <thead>
                <tr>
                    <th>
                        <input class="form-check-input"
                                data-id="${documentView.id}"
                                type="checkbox"
                                ${isSelected ? "checked" : ""}
                                />
                        <span>File Type</span>
                    </th>
                    <th>
                        <span class="file-card__icon--${documentView.documentType}"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Name</td>
                    <td>
                        <span class="${documentView.documentType === "folder" ? "" : "file-card__text-file"}">
                            ${documentView.name}
                        </span>
                    </td>
                </tr>
                <tr>
                    <td>Modified</td>
                    <td>
                        ${documentView.modifiedTimeAgo}
                    </td>
                </tr>
                <tr>
                    <td>Modified By</td>
                    <td>
                        ${documentView.modifiedBy}
                    </td>
                </tr>
                <tr>
                    <td>Actions</td>
                    <td>
                        <div class="file-table__row-actions" aria-hidden="true">
                            <span class="file-table__row-action file-table__row-action--view" title="View details" aria-label="View details" role="button" tabindex="0"></span>
                            <span class="file-table__row-action file-table__row-action--download" title="Download" aria-label="Download" role="button" tabindex="0"></span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
    }
}
