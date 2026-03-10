import { FolderModel } from "../model/_folder.model";
import { DocumentView, documentViewFromFileModel, documentViewFromFolderModel } from "./views/_document.view";

export default function renderTable(currentFolder: FolderModel): void {
    const placeholderList = document.getElementById("documents-table--placeholder--list");
    placeholderList.replaceChildren(); // Clear existing content before re-rendering

    const documentItemViews: DocumentView[] = [];
    currentFolder.files.forEach(file => {
        documentItemViews.push(documentViewFromFileModel(file));
    });
    currentFolder.subFolders.forEach(folder => {
        documentItemViews.push(documentViewFromFolderModel(folder));
    });
    documentItemViews.sort((a, b) => {
        return a.modified.getTime() - b.modified.getTime();
    });
    for (const documentItemView of documentItemViews) {
        const tableRow = createTableRow(documentItemView);
        placeholderList.appendChild(tableRow);
    }
}

function createTableRow(documentView: DocumentView): HTMLElement {
    const templateItem = document.getElementById("documents-table--template--item") as HTMLTemplateElement;
    const cloned = templateItem.content.cloneNode(true) as HTMLElement;

    const rowIcon = createTableRowIcon(documentView.iconName);
    const rowName = documentView.iconName === "folder"
        ? document.createTextNode(documentView.name)
        : createTableRowName(documentView.name);

    cloned.querySelector("tr>td:nth-child(1)").appendChild(rowIcon);
    cloned.querySelector("tr>td:nth-child(2)").appendChild(rowName);
    cloned.querySelector("tr>td:nth-child(3)").appendChild(document.createTextNode(documentView.modifiedStr));
    cloned.querySelector("tr>td:nth-child(4)").appendChild(document.createTextNode(documentView.modifiedBy));

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

