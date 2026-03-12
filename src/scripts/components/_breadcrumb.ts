import { stringToHtmlElement } from "../utilities/_strings";
import { HomePageDocumentBreadcrumbView } from "../pages/home/view-models/_document-breadcrumb.view";

export default function buildBreadcrumbElement(
    folderStack: HomePageDocumentBreadcrumbView[],
    onBreadcrumbFolderClick: (selectedFolderId: string) => void
): HTMLElement {
    const html = buildBreadcrumbHtml(folderStack);
    const breadcrumbElement = stringToHtmlElement(html);
    breadcrumbElement.onclick = (e) => {
        const target = e.target as HTMLElement;
        const linkElement = target.closest('.breadcrumb-link');
        if (linkElement && breadcrumbElement.contains(linkElement)) {
            e.preventDefault(); // Because it's an anchor tag, prevent default navigation, URL change
            e.stopPropagation();
            const folderId = linkElement.getAttribute('data-id');
            if (folderId) {
                onBreadcrumbFolderClick(folderId);
            }
        }
    }
    return breadcrumbElement;
}

function buildBreadcrumbHtml(
    folderStack: HomePageDocumentBreadcrumbView[],
): string {
    const itemListHtml = folderStack.map((folder, index) => {
        if (index === folderStack.length - 1) {
            return buildBreadcrumbItemActiveHtml(folder);
        } else {
            return buildBreadcrumbItemHtml(folder);
        }
    }).join('');

    return `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                ${itemListHtml}
            </ol>
        </nav>
    `;
}

function buildBreadcrumbItemHtml(
    documentBreadcrumb: HomePageDocumentBreadcrumbView,
): string {

    return `
        <li class="breadcrumb-item">
            <a
                data-id="${documentBreadcrumb.id}"
                href="#"
                class="breadcrumb-link"
            >
                ${documentBreadcrumb.name}
            </a>
        </li>
    `;
}

function buildBreadcrumbItemActiveHtml(
    documentBreadcrumb: HomePageDocumentBreadcrumbView
): string {
    return `
        <li class="breadcrumb-item active"
            aria-current="page">
            ${documentBreadcrumb.name}
        </li>
    `;
}


// export default function renderBreadcrumb(
//     folderStack: DocumentBreadcrumbView[],
//     onClick: (selectedFolderId: string) => void
// ): void {




//     const placeholders = document.getElementById("breadcrumb--placeholder");

//     const breadcrumbContainerTemplate = document.getElementById('breadcrumbContainer--template') as HTMLTemplateElement;
//     const breadcrumbItemTemplate = document.getElementById('breadcrumbItem--template') as HTMLTemplateElement;
//     const breadcrumbItemActiveTemplate = document.getElementById('breadcrumbItemActive--template') as HTMLTemplateElement;

//     const breadcrumbContainer = breadcrumbContainerTemplate.content.cloneNode(true) as HTMLElement;
//     const breadcrumbList = breadcrumbContainer.querySelector('.breadcrumb') as HTMLElement;

//     folderStack.forEach((folder, index) => {
//         let item: HTMLElement;
//         if (index === folderStack.length - 1) {
//             item = breadcrumbItemActiveTemplate.content.cloneNode(true) as HTMLElement;
//             const liElement = item.querySelector('li') as HTMLLIElement;
//             liElement.textContent = folder.name;
//         } else {
//             item = breadcrumbItemTemplate.content.cloneNode(true) as HTMLElement;
//             const linkElement = item.querySelector('a') as HTMLAnchorElement;
//             linkElement.innerText = folder.name;
//             linkElement.addEventListener('click', (e) => {
//                 e.preventDefault(); // Because it's an anchor tag
//                 e.stopPropagation();
//                 onClick(folder.id);
//             });
//         }
//         breadcrumbList.appendChild(item);
//     });

//     placeholders?.replaceChildren(breadcrumbContainer);
// }
