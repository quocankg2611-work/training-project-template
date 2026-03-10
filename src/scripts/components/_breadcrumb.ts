export default function renderBreadcrumb(paths: string[], onClick: (crumb: string) => void): void {
    const placeholders = document.querySelectorAll<HTMLDivElement>('#home-page-body--desktop .breadcrumb--placeholder');

    const breadcrumbContainerTemplate = document.getElementById('breadcrumb-container--template') as HTMLTemplateElement;
    const breadcrumbItemTemplate = document.getElementById('breadcrumb-item--template') as HTMLTemplateElement;
    const breadcrumbItemActiveTemplate = document.getElementById('breadcrumb-item-active--template') as HTMLTemplateElement;

    const breadcrumbContainer = breadcrumbContainerTemplate.content.cloneNode(true) as HTMLElement;
    const breadcrumbList = breadcrumbContainer.querySelector('.breadcrumb') as HTMLElement;

    paths.forEach((path, index) => {
        let item: HTMLElement;
        if (index === paths.length - 1) {
            item = breadcrumbItemActiveTemplate.content.cloneNode(true) as HTMLElement;
            const liElement = item.querySelector('li') as HTMLLIElement;
            liElement.textContent = path;
        } else {
            item = breadcrumbItemTemplate.content.cloneNode(true) as HTMLElement;
            const linkElement = item.querySelector('a') as HTMLAnchorElement;
            linkElement.innerText = path;
            linkElement.addEventListener('click', (e) => {
                e.preventDefault();
                onClick(path);
            });
        }
        breadcrumbList.appendChild(item);
    });

    placeholders.forEach((placeholder) => {
        placeholder.appendChild(breadcrumbContainer);
    });
}

