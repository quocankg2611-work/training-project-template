import { stringToHtmlElement } from "../utilities/_strings";

export class BreadcrumbComponent {
    constructor(
        private readonly onBreadcrumbItemClick: (selectedPath: string) => void
    ) { }

    public build(pathArr: string[]): HTMLElement {
        const html = this.buildBreadcrumbHtml(pathArr);
        const breadcrumbElement = stringToHtmlElement(html);
        breadcrumbElement.onclick = (e) => {
            const target = e.target as HTMLElement;
            const linkElement = target.closest('.breadcrumb-link');
            if (linkElement && breadcrumbElement.contains(linkElement)) {
                e.preventDefault(); // Because it's an anchor tag, prevent default navigation, URL change
                e.stopPropagation();
                const path = linkElement.getAttribute('data-breadcrumb-path');
                if (path) {
                    this.onBreadcrumbItemClick(path);
                }
            }
        }
        return breadcrumbElement;
    }

    private buildBreadcrumbHtml(pathArr: string[]): string {
        const itemListHtml = pathArr.map((path, index) => {
            if (index === pathArr.length - 1) {
                return this.buildBreadcrumbItemActiveHtml(path);
            } else {
                return this.buildBreadcrumbItemHtml(path);
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

    private buildBreadcrumbItemHtml(path: string): string {

        return `
        <li class="breadcrumb-item">
            <a
                href="#"
                data-breadcrumb-path="${path}"
                class="breadcrumb-link"
            >
                ${path}
            </a>
        </li>
    `;
    }

    private buildBreadcrumbItemActiveHtml(path: string): string {
        return `
        <li class="breadcrumb-item active"
            aria-current="page">
            ${path}
        </li>
    `;
    }
}
