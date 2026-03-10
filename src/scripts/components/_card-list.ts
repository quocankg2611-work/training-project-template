import { FolderModel } from "../model/folder.model";
import { DocumentView, documentViewFromFileModel, documentViewFromFolderModel } from "./views/document.view";

export default function renderCardList(currentFolder: FolderModel) {
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
        renderCardItem(documentItemView);
    }
}

function renderCardItem(documentView: DocumentView) {
    const templateItem = document.getElementById("card-list--template--item") as HTMLTemplateElement;
    const placeholderList = document.getElementById("card-list--placeholder--list");
    const cloned = templateItem.content.cloneNode(true) as HTMLElement;

    const rowIcon = createCardItemIcon(documentView.iconName);
    const rowName = createCardItemName(documentView.name);

    cloned.querySelector("table>thead>tr:nth-child(1)>th:nth-child(2)").appendChild(rowIcon);
    cloned.querySelector("table>tbody>tr:nth-child(1)>td:nth-child(2)").appendChild(rowName);
    cloned.querySelector("table>tbody>tr:nth-child(2)>td:nth-child(2)").appendChild(document.createTextNode(documentView.modifiedStr));
    cloned.querySelector("table>tbody>tr:nth-child(3)>td:nth-child(2)").appendChild(document.createTextNode(documentView.modifiedBy));
    placeholderList.appendChild(cloned);
}

function createCardItemIcon(iconName: string): HTMLSpanElement {
    const spanElement = document.createElement("span");
    spanElement.className = `file-card__icon--${iconName}`;
    return spanElement;
}

function createCardItemName(name: string): HTMLSpanElement {
    const spanElement = document.createElement("span");
    spanElement.textContent = name;
    spanElement.className = `file-card__text-file`;
    return spanElement;
}

