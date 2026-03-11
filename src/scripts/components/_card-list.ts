import { FolderModel } from "../model/_folder.model";
import { DocumentView, documentViewFromFileModel, documentViewFromFolderModel } from "./views/_document.view";

export default function renderCardList(
    currentFolder: FolderModel,
    onFolderClicked: (folder: FolderModel) => void,
    seletedItem: DocumentView | null,
    onItemSelected: (item: DocumentView) => void,
): void {
    const documentItemViews: DocumentView[] = [];
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
        renderCardItem(documentItemView);
    }
}

function renderCardItem(documentView: DocumentView) {
    const templateItem = document.getElementById("cardList--template-item") as HTMLTemplateElement;
    const placeholderList = document.getElementById("cardList--placeholder-list");
    const cloned = templateItem.content.cloneNode(true) as HTMLElement;

    if (documentView.onDocumentClicked != null) {
        cloned.querySelector(".file-card")?.addEventListener("click", documentView.onDocumentClicked);
    }

    const rowIcon = createCardItemIcon(documentView.documentType);
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

