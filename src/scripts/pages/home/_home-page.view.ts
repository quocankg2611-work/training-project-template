import { BreadcrumbComponent } from "../../components/_breadcrumb";
import { CardListComponent } from "../../components/_card-list";
import { TableComponent } from "../../components/_table";
import { NavbarComponent } from "../../components/_navbar";
import { HomePageDocumentView } from "./_home-page.types";
import { LoginBodyTemplate } from "./_login-body.template";

export class HomePageView {
    private readonly breadcrumbComponent: BreadcrumbComponent;
    private readonly tableComponent: TableComponent;
    private readonly cardListComponent: CardListComponent;
    private readonly navbarComponent: NavbarComponent;
    private readonly loginBodyTemplate: LoginBodyTemplate;

    constructor(
        onBreadcrumbItemClick: (goBackToLevel: number) => void,
        onDocumentItemSelectionChanged: (selectedDocumentId: string, isSelected: boolean) => void,
        onFolderNavigated: (folderId: string) => void,
        onViewDetails: (documentId: string) => void,
        onDownload: (documentId: string) => void,
        private readonly onLoginBtnClick: () => void,
        private readonly onNavbarLogoutClick: () => void,
        private readonly onNavbarNewFolderClick: () => void,
        private readonly onNavbarUploadFolderClick: () => void,
        private readonly onNavbarUploadFileClick: () => void,
        private readonly onActionEditBtnClick: () => void,
        private readonly onActionDeleteBtnClick: () => void,
        private readonly onActionCancelBtnClick: () => void,
    ) {
        this.breadcrumbComponent = new BreadcrumbComponent(onBreadcrumbItemClick);
        this.tableComponent = new TableComponent(
            onDocumentItemSelectionChanged,
            onFolderNavigated,
            onViewDetails,
            onDownload,
        );
        this.cardListComponent = new CardListComponent(
            onDocumentItemSelectionChanged,
            onFolderNavigated,
            onViewDetails,
            onDownload,
        );
        this.navbarComponent = new NavbarComponent(
            this.onNavbarNewFolderClick,
            this.onNavbarUploadFolderClick,
            this.onNavbarUploadFileClick,
            this.onNavbarLogoutClick,
        );
        this.loginBodyTemplate = new LoginBodyTemplate(this.onLoginBtnClick);

    }

    public renderNavbar(isLoggedIn: boolean): void {
        this.render(
            "homePageNavBar--placeholder",
            this.navbarComponent.build(isLoggedIn)
        );
    }

    public toggleLoginState(isLoggedIn: boolean): void {
        const loggedInContainer = document.getElementById("homePage--loggedIn");
        const notLoggedInContainer = document.getElementById("homePage--notLoggedIn");

        if (loggedInContainer) {
            loggedInContainer.classList.toggle("hidden", !isLoggedIn);
        }

        if (notLoggedInContainer) {
            notLoggedInContainer.classList.toggle("hidden", isLoggedIn);
        }
    }

    public renderBreadcrumb(pathArr: string[]): void {
        this.render(
            "homePageBreadcrumb--placeholder",
            this.breadcrumbComponent.build(pathArr)
        );
    }

    public renderBody(
        homePageDocumentViews: HomePageDocumentView[],
        selectedDocumentIds: string[],
    ): void {
        this.render(
            "homePageBodyTable--placeholder",
            this.tableComponent.build(homePageDocumentViews, selectedDocumentIds)
        );

        this.render(
            "homePageBodyCardList--placeholder",
            this.cardListComponent.build(homePageDocumentViews, selectedDocumentIds)
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

    public toggleActionButtons(selectedCount: number): void {
        const isShow = selectedCount > 0;
        const homePageActionElements = document.getElementsByClassName("home-page-actions");
        for (let i = 0; i < homePageActionElements.length; i++) {
            homePageActionElements[i].classList.toggle("hidden", !isShow);
        }

        const selectedCountElement = document.getElementById("selectedCountHomePage");
        if (selectedCountElement) {
            selectedCountElement.textContent = `Selected: ${selectedCount}`;
        }

        const editBtn = document.getElementById("editBtnHomePage");
        if (editBtn) {
            editBtn.classList.toggle("hidden", selectedCount !== 1);
        }
    }

    // TODO
    public toggleErrorMessage(message: string | null): void {
        const container = document.querySelector("#homePage--loggedIn > .flex-grow-1") as HTMLElement | null;
        if (!container) {
            return;
        }

        let errorElement = document.getElementById("homePageErrorMessage");
        if (!errorElement) {
            errorElement = document.createElement("div");
            errorElement.id = "homePageErrorMessage";
            errorElement.className = "alert alert-danger d-none mt-2 mb-2";
            container.insertBefore(errorElement, container.firstChild);
        }

        if (message && message.trim() !== "") {
            errorElement.textContent = message;
            errorElement.classList.remove("d-none");
            return;
        }

        errorElement.textContent = "";
        errorElement.classList.add("d-none");
    }

    /**
     * Replace the placeholder element with the provided id with the given element
     */
    private render(placeholderId: string, element: HTMLElement): void {
        const placeholder = document.getElementById(placeholderId);
        if (placeholder) {
            placeholder.replaceChildren(element);
        }
    }

    public bootstrap(): void {
        this.render(
            "homePageLoginBody--placeholder",
            this.loginBodyTemplate.build()
        );

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
