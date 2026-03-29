import { AddFolderModal } from "../../components/modals/_add-folder-modal";
import { DeleteDocumentModal } from "../../components/modals/_delete-document-modal";
import { UpdateFileModal } from "../../components/modals/_update-file-modal";
import { UpdateFolderNameModal } from "../../components/modals/_update-folder-modal";
import { UploadFileModal } from "../../components/modals/_upload-file-modal";
import { UploadFolderModal } from "../../components/modals/_upload-folder-modal";
import { FileDetailModalComponent } from "../../components/modals/document-detail/_file-detail-modal";
import { FolderDetailModalComponent } from "../../components/modals/document-detail/_folder-detail-modal";
import { UploadPanelComponent } from "../../components/_upload-panel";
import { HomePageModel } from "./_home-page.model";
import { HomePageView } from "./_home-page.view";
import { DocumentModel } from "../../models/_document.model";

export class HomePageController {
    private addFolderModal: AddFolderModal;
    private uploadFileModal: UploadFileModal
    private uploadFolderModal: UploadFolderModal;
    private updateFileModal: UpdateFileModal;
    private updateFolderModal: UpdateFolderNameModal;
    private deleteDocumentModal: DeleteDocumentModal;
    private fileDetailModal: FileDetailModalComponent;
    private folderDetailModal: FolderDetailModalComponent;

    private uploadPanel: UploadPanelComponent;

    private view: HomePageView;
    private model: HomePageModel;

    public bootstrap(): void {
        this.bootstrapModel();
        this.bootstrapView();
        this.bootstrapModals();

        this.view.renderBody(this.model.getDocuments(), this.model.getSelectedDocumentIds());
        this.view.renderBreadcrumb(this.model.getCurrentPathArr());
        this.view.renderNavbar(this.model.getIsLoggedIn());
        this.view.toggleLoginState(this.model.getIsLoggedIn());
        this.view.toggleActionButtons(this.model.getSelectedDocumentCount());

        this.view.bootstrap();
        this.model.initializeAuthStateAsync();
    }

    private bootstrapModals(): void {
        const handleModalUploadFilesConfirm = (files: File[], isFolderUpload: boolean): string | null => {
            return this.model.handleUploadFiles(files, {
                onFileUploadStart: (file) => this.uploadPanel.startUpload(file),
                onFileUploadProgress: (uploadId, progress) => this.uploadPanel.updateProgress(uploadId, progress),
                onFileUploadComplete: (uploadId) => this.uploadPanel.markCompleted(uploadId),
                onFileUploadFailed: (uploadId, errorMessage) => this.uploadPanel.markFailed(uploadId, errorMessage),
            }, isFolderUpload);
        };

        this.addFolderModal = new AddFolderModal(this.model.handleAddFolder.bind(this.model));
        this.uploadFileModal = new UploadFileModal((files) => handleModalUploadFilesConfirm(files, false));
        this.uploadFolderModal = new UploadFolderModal((files) => handleModalUploadFilesConfirm(files, true));
        this.updateFileModal = new UpdateFileModal(this.model.handleUpdateFile.bind(this.model));
        this.updateFolderModal = new UpdateFolderNameModal(this.model.handleUpdateFolderName.bind(this.model));
        this.deleteDocumentModal = new DeleteDocumentModal(this.model.handleDeleteDocuments.bind(this.model));
        this.fileDetailModal = new FileDetailModalComponent();
        this.folderDetailModal = new FolderDetailModalComponent();
    }

    private bootstrapModel(): void {
        const handleIsLoggedInChange = (isLoggedIn: boolean): void => {
            this.view.renderNavbar(isLoggedIn);
            this.view.toggleLoginState(isLoggedIn);
        };

        const handleDocumentsChange = (documents: DocumentModel[]): void => {
            this.view.renderBody(documents, this.model.getSelectedDocumentIds());
        };

        const handleSelectedDocumentsChange = (selectedDocumentIds: string[]): void => {
            this.view.renderBody(this.model.getDocuments(), selectedDocumentIds);
            this.view.toggleActionButtons(selectedDocumentIds.length);
        };

        // TODO
        const handleErrorChange = (error: string | null): void => {
            this.view.toggleErrorMessage(error);
        };

        const handleIsLoadingChange = (isLoading: boolean): void => {
            this.view.toggleBodyLoading(isLoading);
        };

        const handleCurrentFolderChange = (): void => {
            this.view.renderBreadcrumb(this.model.getCurrentPathArr());
        };

        this.model = new HomePageModel(
            handleDocumentsChange,
            handleSelectedDocumentsChange,
            handleErrorChange,
            handleIsLoadingChange,
            handleIsLoggedInChange,
            handleCurrentFolderChange
        );
    }

    private bootstrapView(): void {
        const handleBreadcrumbItemClick = (goBackToLevel: number): void => {
            this.model.handleFolderNavigationGoBackToLevel(goBackToLevel);
        };

        const handleDocumentItemSelectionChanged = (selectedDocumentId: string, isSelected: boolean): void => {
            this.model.setDocumentSelection(selectedDocumentId, isSelected);
        };

        const handleFolderNavigated = (folderId: string): void => {
            this.model.handleFolderNavigationById(folderId);
        };

        const handleNavbarNewFolderClick = (): void => {
            this.addFolderModal.show();
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
            const selectedDocuments = this.model.getSelectedDocuments();
            if (selectedDocuments.length === 0) {
                return;
            }

            if (selectedDocuments.length === 1) {
                const [selectedDocument] = selectedDocuments;
                if (selectedDocument) {
                    this.deleteDocumentModal.showWithData(selectedDocument.id, selectedDocument.name, selectedDocument.documentType);
                }
                return;
            }

            this.deleteDocumentModal.showWithDocuments(selectedDocuments);
        };

        const handleActionCancelBtnClick = (): void => {
            this.model.clearSelectedDocuments();
        };

        const handleLoginBtnClick = (): void => {
            void this.model.handleLogin();
        };

        const handleViewDetails = (documentId: string): void => {
            void this.handleViewDetails(documentId);
        };

        const handleDownload = (documentId: string): void => {
            void this.model.handleDownload(documentId);
        };

        const handleNavbarLogoutClick = (): void => {
            void this.model.handleLogout();
        };

        this.view = new HomePageView(
            handleBreadcrumbItemClick,
            handleDocumentItemSelectionChanged,
            handleFolderNavigated,
            handleViewDetails,
            handleDownload,
            handleLoginBtnClick,
            handleNavbarLogoutClick,
            handleNavbarNewFolderClick,
            handleNavbarUploadFolderClick,
            handleNavbarUploadFileClick,
            handleActionEditBtnClick,
            handleActionDeleteBtnClick,
            handleActionCancelBtnClick
        );

        this.uploadPanel = new UploadPanelComponent();
        this.uploadPanel.mount(document.body);
    }

    private async handleViewDetails(documentId: string): Promise<void> {
        const document = this.model.getDocumentById(documentId);
        if (!document) {
            this.model.setError("Failed to load document details.");
            return;
        }

        this.model.setError(null);

        if (document.documentType === "file") {
            const fileDetail = await this.model.getFileDetailById(documentId);
            if (!fileDetail) {
                this.model.setError("Failed to load file details.");
                return;
            }
            this.fileDetailModal.showWithData(fileDetail);
            return;
        }

        const folderDetail = await this.model.getFolderDetailById(documentId);
        if (!folderDetail) {
            this.model.setError("Failed to load folder details.");
            return;
        }
        this.folderDetailModal.showWithData(folderDetail);
    }
}


/**
 * NOTE: Use arrow function to keep the "this" context of the controller instance when the model calls the change handlers. Otherwise, we need to bind "this" for each handler function, which is more verbose and error-prone.
 */