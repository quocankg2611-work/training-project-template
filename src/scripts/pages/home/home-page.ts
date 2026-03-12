import { createReactiveValue } from "../../abstracts/reactive";
import buildBreadcrumbElement from "../../components/_breadcrumb";
import buildCardListElement from "../../components/_card-list";
import buildTableElement from "../../components/_table";
import { AddFileModal } from "../../components/modals/_add-file-modal";
import { AddFolderModal } from "../../components/modals/_add-folder-modal";
import { DeleteDocumentModal } from "../../components/modals/_delete-document-modal";
import { UpdateFileModal } from "../../components/modals/_update-file-modal";
import { UpdateFolderModal } from "../../components/modals/_update-folder-modal";
import { UploadFileModal } from "../../components/modals/_upload-file-modal";
import { UploadFolderModal } from "../../components/modals/_upload-folder-modal";
import { FolderModel } from "../../model/_folder.model";
import DocumentService from "../../services/_document.service";
import { onAppReady } from "../../utilities/_events";
import { HomePageDocumentBreadcrumbView } from "./view-models/_document-breadcrumb.view";
import { documentViewFromFileModel, documentViewFromFolderModel, HomePageDocumentView } from "./view-models/_document.view";

onAppReady(() => bootstrap());

function bootstrap() {
    const documentService = new DocumentService();

    homePageViewModel(documentService);
}


export default function homePageViewModel(documentService: DocumentService) {

    /**
     * - path 
     * - isLoading
     * - curerntFolders
     * - selectedDocumentItem
     */
    // States

    const currentFolderState = createReactiveValue<FolderModel | null>(null);
    const isLoadingState = createReactiveValue<boolean>(false);
    const folderStackState = createReactiveValue<HomePageDocumentBreadcrumbView[]>([]);
    const selectedDocumentItemState = createReactiveValue<HomePageDocumentView | null>(null);

    isLoadingState.subscribe((_) => {
        homePageBodyTriggers.triggerLoadingChange(isLoadingState.get());
    });

    currentFolderState.subscribe((_) => {
        homePageBodyTriggers.triggerCurrentFolderChange(currentFolderState.get()!);
    });

    selectedDocumentItemState.subscribe((_) => {
        homePageBodyTriggers.triggerSelectedItemChange(selectedDocumentItemState.get());
        homePageActionTriggers.triggerSelectedItemChange(selectedDocumentItemState.get());
    });

    folderStackState.subscribe((_) => {
        homePageBreadcrumbTriggers.triggerFolderStackChange(folderStackState.get());
    });

    // Children

    const homePageActionTriggers = homePageActionViewModel(
        handleActionEditSelectedItem,
        handleActionDeleteSelectedItem,
        handleActionCancelSelectedItem
    );
    const homePageBreadcrumbTriggers = homePageBreadcrumbViewModel(
        handleOnBreadcrumbFolderIdSelected
    );
    const homePageBodyTriggers = homePageBodyViewModel(
        handleOnDocumentItemSelected,
        handleOnFolderNavigated,
    );

    const addFolderModal = new AddFolderModal(handleModalAddFolderConfirm).init();
    const addFileModal = new AddFileModal(handleModalAddFileConfirm).init();
    const uploadFileModal = new UploadFileModal(handleModalUploadFileConfirm).init();
    const uploadFolderModal = new UploadFolderModal(handleModalUploadFolderConfirm).init();
    const updateFileModal = new UpdateFileModal(handleModalUpdateFileConfirm).init();
    const updateFolderModal = new UpdateFolderModal(handleModalUpdateFolderConfirm).init();
    const deleteDocumentModal = new DeleteDocumentModal(handleModalDeleteDocumentConfirm).init();

    // Handlers

    function handleOnFolderNavigated(folder: HomePageDocumentView) {
        isLoadingState.set(true);
        documentService.navigateToFolder(folder.id).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                documentService.getFolderStack().then((folderStack) => {
                    const breadcrumbFolderStack = folderStack.map(folder => {
                        return documentViewFromFolderModel(folder, (f) => currentFolderState.set(f));
                    });
                    folderStackState.set(breadcrumbFolderStack);
                    currentFolderState.set(currentFolder);
                    selectedDocumentItemState.set(null);
                    isLoadingState.set(false);
                });
            });
        });
    }

    function handleModalAddFolderConfirm(folderName: string) {
        isLoadingState.set(true);
        documentService.addFolder(folderName).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                selectedDocumentItemState.set(null);
                currentFolderState.set(currentFolder);
                isLoadingState.set(false);
            });
        });
    }

    function handleModalAddFileConfirm(fileName: string, extension: string, content: string) {
        isLoadingState.set(true);
        documentService.addFile(fileName, extension, content).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                selectedDocumentItemState.set(null);
                currentFolderState.set(currentFolder);
                isLoadingState.set(false);
            });
        });
    }

    function handleModalUploadFileConfirm(fileName: string, extension: string, content: string) {
        isLoadingState.set(true);
        documentService.addFile(fileName, extension, content).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                selectedDocumentItemState.set(null);
                currentFolderState.set(currentFolder);
                isLoadingState.set(false);
            });
        });
    }

    // TODO: Handle the Files
    function handleModalUploadFolderConfirm(folderName: string, files: File[]) {
        isLoadingState.set(true);
        documentService.addFolder(folderName).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                selectedDocumentItemState.set(null);
                currentFolderState.set(currentFolder);
                isLoadingState.set(false);
            });
        });
    }

    function handleModalUpdateFileConfirm(fileId: string, fileName: string) {
        isLoadingState.set(true);
        documentService.updateFile(fileId, fileName).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                selectedDocumentItemState.set(null);
                currentFolderState.set(currentFolder);
                isLoadingState.set(false);
            });
        });
    }

    function handleModalUpdateFolderConfirm(folderId: string, folderName: string) {
        isLoadingState.set(true);
        documentService.updateFolder(folderId, folderName).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                selectedDocumentItemState.set(null);
                currentFolderState.set(currentFolder);
                isLoadingState.set(false);
            });
        });
    }

    function handleModalDeleteDocumentConfirm(documentId: string, documentType: "folder" | "file") {
        isLoadingState.set(true);
        if (documentType === "folder") {
            documentService.deleteFolder(documentId).then(() => {
                documentService.getCurrentFolder().then((currentFolder) => {
                    selectedDocumentItemState.set(null);
                    currentFolderState.set(currentFolder);
                    isLoadingState.set(false);
                });
            });
        } else {
            documentService.deleteFile(documentId).then(() => {
                documentService.getCurrentFolder().then((currentFolder) => {
                    selectedDocumentItemState.set(null);
                    currentFolderState.set(currentFolder);
                    isLoadingState.set(false);
                });
            });
        }
    }

    function handleNavbarAddFolderClick() {
        addFolderModal.show();
    }

    function handleNavbarAddFileClick() {
        addFileModal.show();
    }

    function handleNavbarUploadFileClick() {
        uploadFileModal.show();
    }

    function handleNavbarUploadFolderClick() {
        uploadFolderModal.show();
    }

    function handleActionEditSelectedItem() {
        const selectedDocument = selectedDocumentItemState.get();
        if (!selectedDocument) return;
        if (selectedDocument.documentType === "folder") {
            updateFolderModal.showWithData(selectedDocument.id, selectedDocument.name);
        } else {
            updateFileModal.showWithData(selectedDocument.id, selectedDocument.name);
        }
    }

    function handleActionDeleteSelectedItem() {
        const selectedDocument = selectedDocumentItemState.get();
        if (!selectedDocument) return;
        deleteDocumentModal.showWithData(selectedDocument.id, selectedDocument.name, selectedDocument.documentType);
    }

    function handleActionCancelSelectedItem() {
        selectedDocumentItemState.set(null);
    }

    function handleOnBreadcrumbFolderIdSelected(selectedFolderId: string) {
        isLoadingState.set(true);
        documentService.navigateBackToFolder(selectedFolderId).then(() => {
            documentService.getCurrentFolder().then((currentFolder) => {
                documentService.getFolderStack().then((folderStack) => {
                    const breadcrumbFolderStack = folderStack.map(folder => {
                        return documentViewFromFolderModel(folder, (f) => currentFolderState.set(f));
                    });
                    folderStackState.set(breadcrumbFolderStack);
                    currentFolderState.set(currentFolder);
                    selectedDocumentItemState.set(null);
                    isLoadingState.set(false);
                });
            });
        })
    }

    function handleOnDocumentItemSelected(documentItem: HomePageDocumentView | null) {
        selectedDocumentItemState.set(documentItem);
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

    document.getElementById("homePageNavbarUploadFile")?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNavbarUploadFileClick();
    });

    document.getElementById("homePageNavbarUploadFolder")?.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleNavbarUploadFolderClick();
    });
}

function homePageBreadcrumbViewModel(
    onBreadcrumbFolderIdSelected: (selectedFolderId: string) => void
) {
    const folderStackState = createReactiveValue<HomePageDocumentBreadcrumbView[]>([]);
    folderStackState.subscribe((_) => {
        render();
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

    return {
        triggerFolderStackChange: (DocumentBreadcrumbViews: HomePageDocumentBreadcrumbView[]) => {
            folderStackState.set(DocumentBreadcrumbViews);
        }
    }
}

function homePageBodyViewModel(
    onDocumentItemSelected: (item: HomePageDocumentView | null) => void,
    onFolderNavigated: (item: HomePageDocumentView) => void,
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

    const selectedDocumentState = createReactiveValue<HomePageDocumentView | null>(null);
    selectedDocumentState.subscribe((_) => {
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
            return b.modifiedMs - a.modifiedMs;
        });
        return documentItemViews;
    }

    // View

    function renderList(): void {
        const documentItemViews = computeDocumentItems();
        const tableElement = buildTableElement(
            documentItemViews,
            selectedDocumentState.get()?.id || null,
            onDocumentItemSelected,
            onFolderNavigated,
        );
        const tablePlaceholder = document.getElementById("homePageBodyTable--placeholder");
        if (tablePlaceholder) {
            tablePlaceholder.replaceChildren(tableElement);
        }
        const cardListHtml = buildCardListElement(
            documentItemViews,
            selectedDocumentState.get()?.id || null,
            onDocumentItemSelected,
            onFolderNavigated,
        );
        const cardListPlaceholder = document.getElementById("homePageBodyCardList--placeholder");
        if (cardListPlaceholder) {
            cardListPlaceholder.replaceChildren(cardListHtml);
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

    // Init 

    renderList();

    return {
        triggerSelectedItemChange: (documentItem: HomePageDocumentView | null) => {
            selectedDocumentState.set(documentItem);
        },
        triggerCurrentFolderChange: (currentFolder: FolderModel) => {
            currentFolderState.set(currentFolder);
        },
        triggerLoadingChange: (isLoading: boolean) => {
            isLoadingState.set(isLoading);
        },
    }
}

function homePageActionViewModel(
    onEditSelectedItem: () => void,
    onDeleteSelectedItem: () => void,
    onCancelSelectedItem: () => void
) {
    const selectedDocumentIdState = createReactiveValue<HomePageDocumentView | null>(null);
    selectedDocumentIdState.subscribe((selectedItem) => {
        render(!!selectedItem);
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

    return {
        triggerSelectedItemChange: (documentViewModel: HomePageDocumentView | null) => {
            selectedDocumentIdState.set(documentViewModel);
        }
    }
}
