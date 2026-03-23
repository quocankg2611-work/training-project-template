import { DocumentResponse } from "../../services/_document.service";
import { AddFileModal } from "../../components/modals/_add-file-modal";
import { AddFolderModal } from "../../components/modals/_add-folder-modal";
import { DeleteDocumentModal } from "../../components/modals/_delete-document-modal";
import { UpdateFileModal } from "../../components/modals/_update-file-modal";
import { UpdateFolderModal } from "../../components/modals/_update-folder-modal";
import { UploadFileModal } from "../../components/modals/_upload-file-modal";
import { UploadFolderModal } from "../../components/modals/_upload-folder-modal";
import { UploadPanelComponent } from "../../components/_upload-panel";
import { HomePageModel } from "./_home-page.model";
import { HomePageView } from "./_home-page.view";

export class HomePageController {
    private addFolderModal: AddFolderModal;
    private addFileModal: AddFileModal;
    private uploadFileModal: UploadFileModal
    private uploadFolderModal: UploadFolderModal;
    private updateFileModal: UpdateFileModal;
    private updateFolderModal: UpdateFolderModal;
    private deleteDocumentModal: DeleteDocumentModal;

    private uploadPanel: UploadPanelComponent;

    private view: HomePageView;
    private model: HomePageModel;

    public bootstrap(): void {
        this.bootstrapModel();
        this.bootstrapView();
        this.bootstrapModals();

        this.view.renderBody(this.model.getDocuments(), this.model.getSelectedDocument()?.id ?? null);
        this.view.renderBreadcrumb(this.model.getPathArr());
        this.view.renderNavbar(this.model.getIsLoggedIn());

        this.view.bootstrap();
        this.model.bootstrap();
    }

    private bootstrapModals(): void {

        // TODO: Handle folder upload more detail
        const handleModalUploadFolderConfirm = (folderName: string, files: File[]) => {
            this.model.handleAddFolder(folderName);
        };

        const handleModalUploadFileConfirm = (files: File[]): string | null => {
            return this.model.handleUploadFiles(files, {
                onFileUploadStart: (file) => this.uploadPanel.startUpload(file),
                onFileUploadProgress: (uploadId, progress) => this.uploadPanel.updateProgress(uploadId, progress),
                onFileUploadComplete: (uploadId) => this.uploadPanel.markCompleted(uploadId),
                onFileUploadFailed: (uploadId, errorMessage) => this.uploadPanel.markFailed(uploadId, errorMessage),
            });
        };

        this.addFolderModal = new AddFolderModal(this.model.handleAddFolder.bind(this.model));
        this.addFileModal = new AddFileModal(this.model.handleAddFile.bind(this.model));
        this.uploadFileModal = new UploadFileModal(handleModalUploadFileConfirm);
        this.uploadFolderModal = new UploadFolderModal(handleModalUploadFolderConfirm).bootstrap();
        this.updateFileModal = new UpdateFileModal(this.model.handleUpdateFile.bind(this.model));
        this.updateFolderModal = new UpdateFolderModal(this.model.handleUpdateFolder.bind(this.model));
        this.deleteDocumentModal = new DeleteDocumentModal(this.model.handleDeleteDocument.bind(this.model));
    }

    private bootstrapModel(): void {
        const handleIsLoggedInChange = (isLoggedIn: boolean): void => {
            this.view.renderNavbar(isLoggedIn);
        };

        const handlePathArrChange = (pathArr: string[]): void => {
            this.view.renderBreadcrumb(pathArr);
        };

        const handleDocumentsChange = (documents: DocumentResponse[]): void => {
            this.view.renderBody(documents, this.model.getSelectedDocument()?.id ?? null);
        };

        const handleSelectedDocumentChange = (selectedDocument: DocumentResponse | null): void => {
            this.view.renderBody(this.model.getDocuments(), selectedDocument?.id ?? null);
            this.view.toggleActionButtons(selectedDocument !== null);
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
            handleIsLoggedInChange
        );
    }

    private bootstrapView(): void {
        const handleBreadcrumbItemClick = (goBackToLevel: number): void => {
            this.model.handleFolderNavigationGoBackToLevel(goBackToLevel);
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

        const handleLoginBtnClick = (): void => {
            this.model.handleLogin();
        };

        this.view = new HomePageView(
            handleBreadcrumbItemClick,
            handleDocumentItemSelected,
            handleFolderNavigated,
            handleLoginBtnClick,
            handleNavbarNewFolderClick,
            handleNavbarNewFileClick,
            handleNavbarUploadFolderClick,
            handleNavbarUploadFileClick,
            handleActionEditBtnClick,
            handleActionDeleteBtnClick,
            handleActionCancelBtnClick
        );

        this.uploadPanel = new UploadPanelComponent();
        this.uploadPanel.mount(document.body);
    }
}


/**
 * NOTE: Use arrow function to keep the "this" context of the controller instance when the model calls the change handlers. Otherwise, we need to bind "this" for each handler function, which is more verbose and error-prone.
 */