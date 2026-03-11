import renderBreadcrumb from "../components/_breadcrumb";
import renderCardList from "../components/_card-list";
import renderTable from "../components/_table";
import { DocumentView } from "../components/view-model/_document.view";
import { FolderModel } from "../model/_folder.model";
import DocumentService from "../services/_document.service";

// TODO: Refactor code from home-page.ts to home-page2.ts

export function homePageViewModel(documentService: DocumentService) {

    // Children

    const actionViewModel = homePageActionViewModel();
    const breadcrumbViewModel = homePageBreadcrumbViewModel(
        documentService,
        onBreadcrumbFolderSelected
    );
    const bodyViewModel = homePageBodyViewModel(
        documentService,
        actionViewModel.selectedItem,
        onBodyItemSelected
    );

    // Effects

    async function onBreadcrumbFolderSelected(selectedFolder: FolderModel): Promise<void> {
        await documentService.navigateBackToFolder(selectedFolder.id);
        bodyViewModel.onRefresh();
    }

    async function onBodyItemSelected(item: DocumentView | null): Promise<void> {
        actionViewModel.setSeletectedItem(item);
    }

    // Views

    async function init(): Promise<void> {
        actionViewModel.setSeletectedItem(null);
        breadcrumbViewModel.init();
        bodyViewModel.init();
    }

    return { init };
}

function homePageBreadcrumbViewModel(
    documentService: DocumentService,
    onFolderSelected: (selectedFolder: FolderModel) => void
) {
    async function init(): Promise<void> {
        const folderStack = await documentService.getFolderStack();
        renderBreadcrumb(folderStack, onFolderSelected);
    }

    return { init: init };
}

function homePageBodyViewModel(
    documentService: DocumentService,
    seletedItem: DocumentView | null,
    onItemSelected: (item: DocumentView | null) => void
) {
    let currentFolder: FolderModel | null = null;

    // Effects

    async function onFolderSelected(selectedFolder: FolderModel) {
        renderLoading(true);
        await documentService.navigateToFolder(selectedFolder.id);
        currentFolder = await documentService.getCurrentFolder();
        onItemSelected(null);
        renderLoading(false);
        render();
    }

    async function onRefresh(): Promise<void> {
        renderLoading(true);
        currentFolder = await documentService.getCurrentFolder();
        onItemSelected(null);
        renderLoading(false);
    }

    // Views

    async function init(): Promise<void> {
        renderLoading(true);
        currentFolder = await documentService.getCurrentFolder();
        renderLoading(false);
        render();
    }

    function render(): void {
        if (!currentFolder) return;
        renderTable(
            currentFolder,
            onFolderSelected,
            seletedItem,
            onItemSelected,
        );
        renderCardList(
            currentFolder,
            onFolderSelected,
            seletedItem,
            onItemSelected,
        );
    }

    function renderLoading(isShow: boolean) {
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

    return { init, onRefresh };
}

function homePageActionViewModel() {
    let selectedItem: DocumentView | null = null;

    function setSeletectedItem(item: DocumentView | null) {
        selectedItem = item;
        renderBoolean(!!selectedItem);
    }

    function renderBoolean(isEnabled: boolean) {
        const homePageActionElements = document.getElementsByClassName("home-page-actions");
        for (let i = 0; i < homePageActionElements.length; i++) {
            homePageActionElements[i].classList.toggle("hidden", !isEnabled);
        }
    }

    return {
        setSeletectedItem,
        selectedItem,
    };
}