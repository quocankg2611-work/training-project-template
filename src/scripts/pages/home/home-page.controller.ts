import { DocumentResponse } from "../../apis/_document.api";
import { AddFileModal } from "../../components/modals/_add-file-modal";
import { AddFolderModal } from "../../components/modals/_add-folder-modal";
import { DeleteDocumentModal } from "../../components/modals/_delete-document-modal";
import { UpdateFileModal } from "../../components/modals/_update-file-modal";
import { UpdateFolderModal } from "../../components/modals/_update-folder-modal";
import { UploadFileModal } from "../../components/modals/_upload-file-modal";
import { UploadFolderModal } from "../../components/modals/_upload-folder-modal";
import { HomePageModel } from "./home-page.model";
import { HomePageView } from "./home-page.view";

export class HomePageController {
    private addFolderModal: AddFolderModal;
    private addFileModal: AddFileModal;
    private uploadFileModal: UploadFileModal
    private uploadFolderModal: UploadFolderModal;
    private updateFileModal: UpdateFileModal;
    private updateFolderModal: UpdateFolderModal;
    private deleteDocumentModal: DeleteDocumentModal;

    private view: HomePageView;
    private model: HomePageModel;

    public bootstrap(): void {
        this.bootstrapModel();
        this.bootstrapView();
        this.bootstrapModals();
    }

    private bootstrapModals(): void {
        this.addFolderModal = new AddFolderModal(handleModalAddFolderConfirm).init();
        this.addFileModal = new AddFileModal(handleModalAddFileConfirm).init();
        this.uploadFileModal = new UploadFileModal(handleModalUploadFileConfirm).init();
        this.uploadFolderModal = new UploadFolderModal(handleModalUploadFolderConfirm).init();
        this.updateFileModal = new UpdateFileModal(handleModalUpdateFileConfirm).init();
        this.updateFolderModal = new UpdateFolderModal(handleModalUpdateFolderConfirm).init();
        this.deleteDocumentModal = new DeleteDocumentModal(handleModalDeleteDocumentConfirm).init();

        const handleModalAddFolderConfirm = (folderName: string) => {
            this.model.handleAddFolder(folderName);
            // isLoadingState.set(true);
            // documentService.addFolder(folderName).then(() => {
            //     documentService.getCurrentFolder().then((currentFolder) => {
            //         selectedDocumentItemState.set(null);
            //         currentFolderState.set(currentFolder);
            //         isLoadingState.set(false);
            //     });
            // });
        }

        function handleModalAddFileConfirm(fileName: string, extension: string, content: string) {
            // isLoadingState.set(true);
            // documentService.addFile(fileName, extension, content).then(() => {
            //     documentService.getCurrentFolder().then((currentFolder) => {
            //         selectedDocumentItemState.set(null);
            //         currentFolderState.set(currentFolder);
            //         isLoadingState.set(false);
            //     });
            // });
        }

        function handleModalUploadFileConfirm(fileName: string, extension: string, content: string) {
            // isLoadingState.set(true);
            // documentService.addFile(fileName, extension, content).then(() => {
            //     documentService.getCurrentFolder().then((currentFolder) => {
            //         selectedDocumentItemState.set(null);
            //         currentFolderState.set(currentFolder);
            //         isLoadingState.set(false);
            //     });
            // });
        }

        // TODO: Handle folder upload more detail
        function handleModalUploadFolderConfirm(folderName: string, files: File[]) {
            // isLoadingState.set(true);
            // documentService.addFolder(folderName).then(() => {
            //     documentService.getCurrentFolder().then((currentFolder) => {
            //         selectedDocumentItemState.set(null);
            //         currentFolderState.set(currentFolder);
            //         isLoadingState.set(false);
            //     });
            // });
        }

        function handleModalUpdateFileConfirm(fileId: string, fileName: string) {
            // isLoadingState.set(true);
            // documentService.updateFile(fileId, fileName).then(() => {
            //     documentService.getCurrentFolder().then((currentFolder) => {
            //         selectedDocumentItemState.set(null);
            //         currentFolderState.set(currentFolder);
            //         isLoadingState.set(false);
            //     });
            // });
        }

        function handleModalUpdateFolderConfirm(folderId: string, folderName: string) {
            // isLoadingState.set(true);
            // documentService.updateFolder(folderId, folderName).then(() => {
            //     documentService.getCurrentFolder().then((currentFolder) => {
            //         selectedDocumentItemState.set(null);
            //         currentFolderState.set(currentFolder);
            //         isLoadingState.set(false);
            //     });
            // });
        }

        function handleModalDeleteDocumentConfirm(documentId: string, documentType: "folder" | "file") {
            // isLoadingState.set(true);
            // if (documentType === "folder") {
            //     documentService.deleteFolder(documentId).then(() => {
            //         documentService.getCurrentFolder().then((currentFolder) => {
            //             selectedDocumentItemState.set(null);
            //             currentFolderState.set(currentFolder);
            //             isLoadingState.set(false);
            //         });
            //     });
            // } else {
            //     documentService.deleteFile(documentId).then(() => {
            //         documentService.getCurrentFolder().then((currentFolder) => {
            //             selectedDocumentItemState.set(null);
            //             currentFolderState.set(currentFolder);
            //             isLoadingState.set(false);
            //         });
            //     });
            // }
        }

    }

    /**
     * Use arrow function to keep the "this" context of the controller instance when the model calls the change handlers. Otherwise, we need to bind "this" for each handler function, which is more verbose and error-prone.
     */
    private bootstrapModel(): void {
        const handlePathArrChange = (pathArr: string[]): void => {
            this.view.renderBreadcrumb(pathArr);
        };

        const handleDocumentsChange = (documents: DocumentResponse[]): void => {
            this.view.renderBody(documents, this.model.getSelectedDocument()?.id ?? null);
        };

        const handleSelectedDocumentChange = (selectedDocument: DocumentResponse | null): void => {
            this.view.renderBody(this.model.getDocuments(), selectedDocument?.id ?? null);
            this.view.toggleActionButtons(selectedDocument?.id !== null);
        };

        // TODO
        const handleErrorChange = (error: string | null): void => {
        };

        const handleIsLoadingChange = (isLoading: boolean): void => {
            this.view.toggleBodyLoading(isLoading);
        };

        this.model = new HomePageModel(
            handlePathArrChange,
            handleDocumentsChange,
            handleSelectedDocumentChange,
            handleErrorChange,
            handleIsLoadingChange,
        );
    }

    private bootstrapView(): void {
        const handleBreadcrumbItemClick = (selectedFolderPath: string): void => {
            this.model.handleFolderNavigationByName(selectedFolderPath);
        };

        const handleDocumentItemSelected = (selectedDocumentId: string | null): void => {
            this.model.setSelectedDocumentById(selectedDocumentId);
        };

        const handleFolderNavigated = (folderId: string): void => {
            this.model.handleFolderNavigationById(folderId);
        };

        const handleNavbarNewFolderClick = (): void => {
            this.addFolderModal.show();
        };

        const handleNavbarNewFileClick = (): void => {
            this.addFileModal.show();
        };

        const handleNavbarUploadFolderClick = (): void => {
            this.uploadFolderModal.show();
        };

        const handleNavbarUploadFileClick = (): void => {
            this.uploadFileModal.show();
        };

        const handleActionEditBtnClick = (): void => {
            const selectedDocument = this.model.getSelectedDocument();
            if (selectedDocument) {
                if (selectedDocument.documentType === "folder") {
                    this.updateFolderModal.showWithData(selectedDocument.id, selectedDocument.name);
                } else {
                    this.updateFileModal.showWithData(selectedDocument.id, selectedDocument.name);
                }
            }
        };

        const handleActionDeleteBtnClick = (): void => {
            const selectedDocument = this.model.getSelectedDocument();
            if (selectedDocument) {
                this.deleteDocumentModal.showWithData(selectedDocument.id, selectedDocument.name, selectedDocument.documentType);
            }
        };

        const handleActionCancelBtnClick = (): void => {
            this.model.setSelectedDocument(null);
        };

        this.view = new HomePageView(
            handleBreadcrumbItemClick,
            handleDocumentItemSelected,
            handleFolderNavigated,
            handleNavbarNewFolderClick,
            handleNavbarNewFileClick,
            handleNavbarUploadFolderClick,
            handleNavbarUploadFileClick,
            handleActionEditBtnClick,
            handleActionDeleteBtnClick,
            handleActionCancelBtnClick
        );
    }
}
