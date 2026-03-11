import { FolderModel } from "../model/_folder.model";
import { DocumentViewModel, documentViewFromFileModel, documentViewFromFolderModel } from "../view-model/_document.view";

export default function renderTable(
    currentFolder: FolderModel,
    onFolderClicked: (folder: FolderModel) => void,
    selectedItem: DocumentViewModel | null,
    onItemSelected: (item: DocumentViewModel) => void
): void {
    const placeholderList = document.getElementById("documentsTable--placeholder-list");
    if (!placeholderList) return;

    placeholderList.replaceChildren(); // Clear existing content before re-rendering

    const documentItemViews: DocumentViewModel[] = [];
    currentFolder.files.forEach(file => {
        documentItemViews.push(documentViewFromFileModel(file));
    });
    currentFolder.subFolders.forEach(folder => {
        documentItemViews.push(documentViewFromFolderModel(folder, onFolderClicked));
    });
    documentItemViews.sort((a, b) => {
        return a.modified.getTime() - b.modified.getTime();
    });
    for (const documentItemView of documentItemViews) {
        const tableRow = createTableRow(documentItemView, selectedItem, onItemSelected);
        placeholderList.appendChild(tableRow);
    }
}

function createTableRow(
    documentView: DocumentViewModel,
    selectedItem: DocumentViewModel | null,
    onItemSelected: (item: DocumentViewModel) => void
): HTMLElement {
    const templateItem = document.getElementById("documentsTable--template-item") as HTMLTemplateElement;
    const cloned = templateItem.content.cloneNode(true) as HTMLElement;

    if (documentView.onDocumentClicked != null) {
        cloned.querySelector("tr")?.addEventListener("click", documentView.onDocumentClicked);
    }

    const rowIcon = createTableRowIcon(documentView.documentType);
    const rowName = documentView.documentType === "folder"
        ? document.createTextNode(documentView.name)
        : createTableRowName(documentView.name);

    const actionSelectArea = cloned.querySelector("tr>td:nth-child(1)");
    actionSelectArea?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onItemSelected(documentView);
    });

    const radioInput = cloned.querySelector<HTMLInputElement>("tr>td:nth-child(1)>input[type='radio'][name='file-table-select']");
    if (radioInput) {
        radioInput.checked = documentView.id === selectedItem?.id;
    }
    cloned.querySelector("tr>td:nth-child(2)")?.appendChild(rowIcon);
    cloned.querySelector("tr>td:nth-child(3)")?.appendChild(rowName);
    cloned.querySelector("tr>td:nth-child(4)")?.appendChild(document.createTextNode(documentView.modifiedStr));
    cloned.querySelector("tr>td:nth-child(5)")?.appendChild(document.createTextNode(documentView.modifiedBy));

    return cloned;
}

function createTableRowIcon(iconName: string): HTMLSpanElement {
    const spanElement = document.createElement("span");
    spanElement.className = `file-table__icon--${iconName}`;
    return spanElement;
}

function createTableRowName(name: string): HTMLSpanElement {
    const spanElement = document.createElement("span");
    spanElement.textContent = name;
    spanElement.className = `file-table__text-file`;
    return spanElement;
}

