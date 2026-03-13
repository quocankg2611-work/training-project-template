import { stringToHtmlElement } from "../utilities/_strings";

export class BreadcrumbComponent {
    constructor(
        private readonly onBreadcrumbItemClick: (goBackToLevel: number) => void,
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
                const goBackToLevel = parseInt(linkElement.getAttribute('data-go-back-to-level') || '0', 10);
                this.onBreadcrumbItemClick(goBackToLevel);
            }
        }
        return breadcrumbElement;
    }

    private buildBreadcrumbHtml(pathArr: string[]): string {
        const pathArrWithHome = ["Home", ...pathArr];
        const itemListHtml = pathArrWithHome.map((path, index) => {
            if (index === pathArrWithHome.length - 1) {
                return this.buildBreadcrumbItemActiveHtml(path);
            }
            return this.buildBreadcrumbItemHtml(path, index);
        }).join('');

        return `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                ${itemListHtml}
            </ol>
        </nav>
    `;
    }


    private buildBreadcrumbItemHtml(path: string, levelToGoBack: number): string {

        return `
        <li class="breadcrumb-item">
            <a
                href="#"
                class="breadcrumb-link"
                data-go-back-to-level="${levelToGoBack}"
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
