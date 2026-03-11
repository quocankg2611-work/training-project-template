import { DocumentBreadcrumbViewModel } from "../view-model/_document-breadcrumb.view-model";

export default function renderBreadcrumb(
    folderStack: DocumentBreadcrumbViewModel[],
    onClick: (selectedFolderId: string) => void
): void {
    const placeholders = document.getElementById("breadcrumb--placeholder");

    const breadcrumbContainerTemplate = document.getElementById('breadcrumbContainer--template') as HTMLTemplateElement;
    const breadcrumbItemTemplate = document.getElementById('breadcrumbItem--template') as HTMLTemplateElement;
    const breadcrumbItemActiveTemplate = document.getElementById('breadcrumbItemActive--template') as HTMLTemplateElement;

    const breadcrumbContainer = breadcrumbContainerTemplate.content.cloneNode(true) as HTMLElement;
    const breadcrumbList = breadcrumbContainer.querySelector('.breadcrumb') as HTMLElement;

    folderStack.forEach((folder, index) => {
        let item: HTMLElement;
        if (index === folderStack.length - 1) {
            item = breadcrumbItemActiveTemplate.content.cloneNode(true) as HTMLElement;
            const liElement = item.querySelector('li') as HTMLLIElement;
            liElement.textContent = folder.name;
        } else {
            item = breadcrumbItemTemplate.content.cloneNode(true) as HTMLElement;
            const linkElement = item.querySelector('a') as HTMLAnchorElement;
            linkElement.innerText = folder.name;
            linkElement.addEventListener('click', (e) => {
                e.preventDefault(); // Because it's an anchor tag
                e.stopPropagation();
                onClick(folder.id);
            });
        }
        breadcrumbList.appendChild(item);
    });

    placeholders?.replaceChildren(breadcrumbContainer);
}
