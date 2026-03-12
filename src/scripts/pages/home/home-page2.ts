import { createReactiveValue } from "../../abstracts/reactive";
import buildBreadcrumbElement from "../../components_2/_breadcrumb";
import buildCardList from "../../components_2/_card-list";
import buildTable from "../../components_2/_table";
import { AddFileModal } from "../../components_2/modals/_add-file-modal";
import { AddFolderModal } from "../../components_2/modals/_add-folder-modal";
import { DeleteDocumentModal } from "../../components_2/modals/_delete-document-modal";
import { UpdateFileModal } from "../../components_2/modals/_update-file-modal";
import { UpdateFolderModal } from "../../components_2/modals/_update-folder-modal";
import { UploadFileModal } from "../../components_2/modals/_upload-file-modal";
import { UploadFolderModal } from "../../components_2/modals/_upload-folder-modal";
import { FolderModel } from "../../model/_folder.model";
import DocumentService from "../../services/_document.service";
import { DocumentBreadcrumbView } from "./view-models/_document-breadcrumb.view";
import { documentViewFromFileModel, documentViewFromFolderModel, HomePageDocumentView } from "./view-models/_document.view";

// TODO: Refactor code from home-page.ts to home-page2.ts

export function homePageViewModel(documentService: DocumentService) {

    // States

    const currentFolderState = createReactiveValue<FolderModel | null>(null);

    const documentsState = createReactiveValue<HomePageDocumentView[]>([]);
    const selectedDocumentItemState = createReactiveValue<HomePageDocumentView | null>(null);
    const isLoadingState = createReactiveValue<boolean>(false);

    const subscribeToSelectedDocumentIdChange = (
        triggerSelectedDocumentIdChanged: (selectedDocumentId: string | null) => void
    ) => {
        selectedDocumentItemState.subscribe((selectedDocument) => {
            triggerSelectedDocumentIdChanged(selectedDocument ? selectedDocument.id : null);
        });
    };

    // Children

    homePageActionViewModel(
        subscribeToSelectedDocumentIdChange,
        handleActionEditSelectedItem,
        handleActionDeleteSelectedItem,
        handleActionCancelSelectedItem
    );
    homePageBreadcrumbViewModel(
        currentFolderState.subscribe,
        handleOnBreadcrumbFolderIdSelected
    );
    homePageBodyViewModel(
        subscribeToSelectedDocumentIdChange,
        currentFolderState.subscribe,
        isLoadingState.subscribe,
        handleOnDocumentItemSelected
    );

    const addFolderModal = new AddFolderModal(handleModalAddFolderConfirm);
    const addFileModal = new AddFileModal(handleModalAddFileConfirm);
    const uploadFileModal = new UploadFileModal(handleModalUploadFileConfirm);
    const uploadFolderModal = new UploadFolderModal(handleModalUploadFolderConfirm);
    const updateFileModal = new UpdateFileModal(handleModalUpdateFileConfirm);
    const updateFolderModal = new UpdateFolderModal(handleModalUpdateFolderConfirm);
    const deleteDocumentModal = new DeleteDocumentModal(handleModalDeleteDocumentConfirm);

    // Handlers

    function handleModalAddFolderConfirm(folderName: string) {
    }

    function handleModalAddFileConfirm(fileName: string) {
    }

    function handleModalUploadFileConfirm(fileName: string, extension: string, content: string) {
    }

    function handleModalUploadFolderConfirm(folderName: string, files: File[]) {
    }

    function handleModalUpdateFileConfirm(fileId: string, fileName: string) {
    }

    function handleModalUpdateFolderConfirm(folderId: string, folderName: string) {
    }

    function handleModalDeleteDocumentConfirm(documentId: string, documentType: "folder" | "file") {
    }

    function handleNavbarAddFolderClick() {
        addFolderModal.show();
    }

    function handleNavbarAddFileClick() {
        addFileModal.show();
    }

    function handleActionEditSelectedItem() {
        const selectedDocument = selectedDocumentItemState.get();
        if (!selectedDocument) return;
        if (selectedDocument.documentType === "folder") {
            updateFolderModal
        }
    }

    function handleActionDeleteSelectedItem() {
    }

    function handleActionCancelSelectedItem() {
    }

    function handleOnBreadcrumbFolderIdSelected(selectedFolder: string) {
        // Handle when user click on breadcrumb item to navigate back to specific folder
    }

    function handleOnDocumentItemSelected(documentItem: HomePageDocumentView | null) {
        // Handle when user click on document item in table or card list
    }

    // Init

    isLoadingState.set(true);
    documentService.loadRootFolder().then(() => {
        documentService.getCurrentFolder().then((currentFolder) => {
            currentFolderState.set(currentFolder);
            isLoadingState.set(false);
        });
    });

    document.getElementById("homePageNavbarNewFolder")?.addEventListener("click", (e) => {
        e.preventDefault(); // anchor element
        e.stopPropagation();
        handleNavbarAddFolderClick();
    });

    document.getElementById("homePageNavbarNewFile")?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNavbarAddFileClick();
    });
}

function homePageBreadcrumbViewModel(
    listenOnFCurrentFolderChange: (onChange: (currentFolder: FolderModel | null) => void) => void,
    onBreadcrumbFolderIdSelected: (selectedFolderId: string) => void
) {

    // State

    const folderStackState = createReactiveValue<DocumentBreadcrumbView[]>([]);
    folderStackState.subscribe((_) => {
        render();
    });

    // Listen

    listenOnFCurrentFolderChange((currentFolder) => {
        if (!currentFolder) {
            folderStackState.set([]);
        } else {
            const newFolderStack = [...folderStackState.get()];
            newFolderStack.push(currentFolder);
            folderStackState.set(newFolderStack);
        }
    });

    // View

    function render(): void {
        const breadcrumbDocuments = folderStackState.get();
        const breadcrumbElement = buildBreadcrumbElement(
            breadcrumbDocuments,
            onBreadcrumbFolderIdSelected
        );
        const breadcrumbPlaceholder = document.getElementById("homePageBreadcrumb--placeholder");
        if (breadcrumbPlaceholder) {
            breadcrumbPlaceholder.replaceChildren(breadcrumbElement);
        }
    }

    // Init

    render();
}

function homePageBodyViewModel(
    listenOnSelectedDocumentIdChange: (onChange: (selectedItemId: string | null) => void) => void,
    listenOnCurrentFolderChange: (onChange: (currentFolder: FolderModel | null) => void) => void,
    listenOnIsLoadingChange: (onChange: (isLoading: boolean) => void) => void,
    onDocumentItemSelected: (item: HomePageDocumentView | null) => void
) {
    // State

    const isLoadingState = createReactiveValue<boolean>(false);
    isLoadingState.subscribe((isLoading) => {
        renderLoading(isLoading);
    });

    const currentFolderState = createReactiveValue<FolderModel | null>(null);
    currentFolderState.subscribe((_) => {
        renderList();
    });

    const selectedDocumentIdState = createReactiveValue<string | null>(null);
    selectedDocumentIdState.subscribe((_) => {
        renderList();
    });

    // Compute

    function computeDocumentItems(): HomePageDocumentView[] {
        const currentFolder = currentFolderState.get();
        if (!currentFolder) return [];
        const documentItemViews: HomePageDocumentView[] = [];
        currentFolder.files.forEach(file => {
            documentItemViews.push(documentViewFromFileModel(file));
        });
        currentFolder.subFolders.forEach(folder => {
            documentItemViews.push(documentViewFromFolderModel(folder, (f) => currentFolderState.set(f)));
        });
        documentItemViews.sort((a, b) => {
            return b.modified.getTime() - a.modified.getTime();
        });
        return documentItemViews;
    }

    // Listen

    listenOnSelectedDocumentIdChange((selectedItemId) => {
        selectedDocumentIdState.set(selectedItemId);
    });

    listenOnCurrentFolderChange((currentFolder) => {
        currentFolderState.set(currentFolder);
    });

    listenOnIsLoadingChange((isLoading) => {
        isLoadingState.set(isLoading);
    });

    // View

    function renderList(): void {
        const documentItemViews = computeDocumentItems();
        const tableHtml = buildTable(
            documentItemViews,
            selectedDocumentIdState.get(),
            onDocumentItemSelected
        );
        const tablePlaceholder = document.getElementById("homePageBodyTable--placeholder");
        if (tablePlaceholder) {
            tablePlaceholder.innerHTML = tableHtml;
        }
        const cardListHtml = buildCardList(
            documentItemViews,
            selectedDocumentIdState.get(),
            onDocumentItemSelected
        );
        const cardListPlaceholder = document.getElementById("homePageBodyCardList--placeholder");
        if (cardListPlaceholder) {
            cardListPlaceholder.innerHTML = cardListHtml;
        }
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
}

function homePageActionViewModel(
    listenOnSelectedItemChange: (onChange: (selectedDocumentId: string | null) => void) => void,
    onEditSelectedItem: () => void,
    onDeleteSelectedItem: () => void,
    onCancelSelectedItem: () => void
) {
    const selectedDocumentIdState = createReactiveValue<string | null>(null);
    selectedDocumentIdState.subscribe((selectedItem) => {
        render(!!selectedItem);
    });

    listenOnSelectedItemChange((documentViewModel) => {
        selectedDocumentIdState.set(documentViewModel);
    });

    function render(isEnabled: boolean) {
        const homePageActionElements = document.getElementsByClassName("home-page-actions");
        for (let i = 0; i < homePageActionElements.length; i++) {
            homePageActionElements[i].classList.toggle("hidden", !isEnabled);
        }
    }

    // Init

    document.getElementById("editBtnHomePage")?.addEventListener("click", () => {
        onEditSelectedItem();
    });
    document.getElementById("deleteBtnHomePage")?.addEventListener("click", () => {
        onDeleteSelectedItem();
    });
    document.getElementById("cancelBtnHomePage")?.addEventListener("click", () => {
        onCancelSelectedItem();
    });
}
