import { DocumentViewModel } from "../view-model/_document.view";

export default function buildCardList(
    documentItemViews: DocumentViewModel[],
    selectedItemId: string | null,
    onItemSelected: (item: DocumentViewModel) => void,
): string {
    const html = `
    	<div class="home-page__list d-flex flex-column flex-grow-1">
            <div class="home-page__list-loading-container">
                <div class="loader loader--spinner"></div>
            </div>

            <div class="d-flex flex-column gap-4 pb-5">
                ${documentItemViews.map((view) => buildCardItem(view, selectedItemId, onItemSelected)).join("")}
            </div>
        </div>
    `;
    return html;
}

function buildCardItem(
    documentView: DocumentViewModel,
    selectedItemId: string | null,
    onItemSelected: (item: DocumentViewModel) => void
): string {

    const handleOnSelectionAreaClick = (e: MouseEvent) => {
        e.stopPropagation();
        onItemSelected(documentView);
    }

    return `
        <table 
            class="file-card" 
            data-id="${documentView.id}"
            onclick="${documentView.onDocumentClicked ? `(${documentView.onDocumentClicked.toString()})()` : ""}"
        >
            <thead>
                <tr>
                    <th onclick="(${handleOnSelectionAreaClick.toString()})(event)">
                        <input class="form-check-input"
                                type="radio"
                                name="file-card-select" 
                                checked="${documentView.id === selectedItemId}"
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
