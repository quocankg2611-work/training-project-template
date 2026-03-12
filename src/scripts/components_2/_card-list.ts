import { HomePageDocumentView } from "../pages/home/view-models/_document.view";
import { stringToHtmlElement } from "../utilities/_strings";

export default function buildCardListElement(
    documentItemViews: HomePageDocumentView[],
    selectedItemId: string | null,
    onItemSelected: (item: HomePageDocumentView) => void,
    onFolderNavigated: (item: HomePageDocumentView) => void,
): HTMLElement {
    const cardListHtml = buildCardListHtml(documentItemViews, selectedItemId);
    const cardListElement = stringToHtmlElement(cardListHtml);

    // Attach selection event listeners
    for (const documentView of documentItemViews) {
        const cardElement = cardListElement.querySelector(`table[data-id="${documentView.id}"]`);
        if (documentView.documentType === "folder") {
            cardElement?.addEventListener("click", () => {
                onFolderNavigated(documentView);
            });
        }

        const selectionArea = cardElement?.querySelector(`thead>tr>th:first-child`);
        selectionArea?.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent the click from bubbling up to the card's click event
            onItemSelected(documentView);
        });
    }

    return cardListElement;
}

function buildCardListHtml(
    documentItemViews: HomePageDocumentView[],
    selectedItemId: string | null,
): string {
    const html = `
    	<div class="home-page__list d-flex flex-column flex-grow-1">
            <div class="home-page__list-loading-container hidden">
                <div class="loader loader--spinner"></div>
            </div>

            <div class="d-flex flex-column gap-4 pb-5">
                ${documentItemViews.map((view) => buildCardItem(view, selectedItemId)).join("")}
            </div>
        </div>
    `;
    return html;
}

function buildCardItem(
    documentView: HomePageDocumentView,
    selectedItemId: string | null,
): string {
    return `
        <table 
            class="file-card" 
            data-id="${documentView.id}"
            onclick="${documentView.onDocumentClicked ? `(${documentView.onDocumentClicked.toString()})()` : ""}"
        >
            <thead>
                <tr>
                    <th>
                        <input class="form-check-input"
                                type="radio"
                                name="file-card-select" 
                                ${documentView.id === selectedItemId ? "checked" : ""}
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
                        ${documentView.modifiedStr}
                    </td>
                </tr>
                <tr>
                    <td>Modified By</td>
                    <td>
                        ${documentView.modifiedBy}
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}
