import { DocumentViewModel } from "../view-model/_document.view";

export default function buildTable(
    items: DocumentViewModel[],
    selectedItemId: string | null,
    onItemSelected: (item: DocumentViewModel | null) => void
): string {
    const html = `
        <div class="home-page__table">
            <div class="home-page__table-loading-container">
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
                   ${items.map(item => buildTableRow(item, selectedItemId, onItemSelected)).join("")}
                </tbody>
            </table>
        </div>
    `;

    return html;
}

function buildTableRow(
    item: DocumentViewModel,
    selectedItemId: string | null,
    onItemSelected: (item: DocumentViewModel) => void
): string {
    const html = `
        <tr>
            <td onclick="(${() => onItemSelected(item)})()">
                <input class="form-check-input"
                        type="radio"
                        name="file-table-select"
                        checked="${item.id === selectedItemId}"
                        />
            </td>
            <td>
                <span class="file-table__icon--${item.documentType}"></span>
            </td>
            <td>
                <span class="file-table__text-file">${item.name}</span>
            </td>
            <td>
                ${item.modifiedStr}
            </td>
            <td>
                ${item.modifiedBy}
            </td>
            <td></td>
        </tr>
            `;

    return html;
}
