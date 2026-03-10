import { FolderModel } from "../model/_folder.model";

export default function renderBreadcrumb(folderStack: FolderModel[], onClick: (selectedFolder: FolderModel) => void): void {
    const placeholders = document.querySelectorAll<HTMLDivElement>('#home-page-body--desktop .breadcrumb--placeholder');

    const breadcrumbContainerTemplate = document.getElementById('breadcrumb-container--template') as HTMLTemplateElement;
    const breadcrumbItemTemplate = document.getElementById('breadcrumb-item--template') as HTMLTemplateElement;
    const breadcrumbItemActiveTemplate = document.getElementById('breadcrumb-item-active--template') as HTMLTemplateElement;

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
                e.preventDefault();
                onClick(folder);
            });
        }
        breadcrumbList.appendChild(item);
    });

    placeholders.forEach((placeholder) => {
        placeholder.replaceChildren();
        placeholder.appendChild(breadcrumbContainer);
    });
}

