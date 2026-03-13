import { BreadcrumbComponent } from "../../components/_breadcrumb2";
import { CardListComponent } from "../../components/_card-list2";
import { TableComponent } from "../../components/_table2";
import { HomePageDocumentView } from "./view-models/_document.view";

export class HomePageView {
    private readonly breadcrumbComponent: BreadcrumbComponent;
    private readonly tableComponent: TableComponent;
    private readonly cardListComponent: CardListComponent;

    constructor(
        onBreadcrumbItemClick: (selectedFolderPath: string) => void,
        onDocumentItemSelected: (selectedDocumentId: string | null) => void,
        onFolderNavigated: (folderId: string) => void,
        private readonly onNavbarNewFolderClick: () => void,
        private readonly onNavbarNewFileClick: () => void,
        private readonly onNavbarUploadFolderClick: () => void,
        private readonly onNavbarUploadFileClick: () => void,
        private readonly onActionEditBtnClick: () => void,
        private readonly onActionDeleteBtnClick: () => void,
        private readonly onActionCancelBtnClick: () => void,
    ) {
        this.breadcrumbComponent = new BreadcrumbComponent(onBreadcrumbItemClick);
        this.tableComponent = new TableComponent(onDocumentItemSelected, onFolderNavigated);
        this.cardListComponent = new CardListComponent(onDocumentItemSelected, onFolderNavigated);
        this.bootstrapEvents();
    }

    public renderBreadcrumb(pathArr: string[]): void {
        this.render(
            "homePageBreadcrumb--placeholder",
            this.breadcrumbComponent.build(pathArr)
        )
    }

    public renderBody(
        homePageDocumentViews: HomePageDocumentView[],
        selectedDocumentId: string | null,
    ): void {
        this.render(
            "homePageBodyTable--placeholder",
            this.tableComponent.build(homePageDocumentViews, selectedDocumentId)
        );

        this.render(
            "homePageBodyCardList--placeholder",
            this.cardListComponent.build(homePageDocumentViews, selectedDocumentId)
        );
    }

    public toggleBodyLoading(isShow: boolean) {
        const homePage = document.getElementById("homePage")!;
        const tableLoaderElements = homePage.querySelector<HTMLDivElement>(".home-page__table-loading-container")!;
        const listLoaderElement = homePage.querySelector<HTMLDivElement>(".home-page__list-loading-container")!;
        if (isShow) {
            tableLoaderElements.classList.remove("hidden");
            listLoaderElement.classList.remove("hidden");
        } else {
            tableLoaderElements.classList.add("hidden");
            listLoaderElement.classList.add("hidden");
        }
    }

    public toggleActionButtons(isShow: boolean): void {
        const homePageActionElements = document.getElementsByClassName("home-page-actions");
        for (let i = 0; i < homePageActionElements.length; i++) {
            homePageActionElements[i].classList.toggle("hidden", !isShow);
        }
    }

    // TODO
    public toggleErrorMessage(message: string | null): void {

    }

    /**
     * Replace the placeholder element with the provided id with the given element
     */
    private render(placeholderId: string, element: HTMLElement): void {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.replaceWith(element);
        }
    }


    private bootstrapEvents(): void {
        document.getElementById("homePageNavbarNewFolder")?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarNewFolderClick();
        });

        document.getElementById("homePageNavbarNewFile")?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarNewFileClick();
        });

        document.getElementById("homePageNavbarUploadFile")?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarUploadFileClick();
        });

        document.getElementById("homePageNavbarUploadFolder")?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarUploadFolderClick();
        });

        document.getElementById("editBtnHomePage")?.addEventListener("click", () => {
            this.onActionEditBtnClick();
        });

        document.getElementById("deleteBtnHomePage")?.addEventListener("click", () => {
            this.onActionDeleteBtnClick();
        });

        document.getElementById("cancelBtnHomePage")?.addEventListener("click", () => {
            this.onActionCancelBtnClick();
        });
    }
}
