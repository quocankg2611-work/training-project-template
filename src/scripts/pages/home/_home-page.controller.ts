import { DocumentResponse } from "../../services/_document.service";
import { AddFileModal } from "../../components/modals/_add-file-modal";
import { AddFolderModal } from "../../components/modals/_add-folder-modal";
import { DeleteDocumentModal } from "../../components/modals/_delete-document-modal";
import { UpdateFileModal } from "../../components/modals/_update-file-modal";
import { UpdateFolderModal } from "../../components/modals/_update-folder-modal";
import { UploadFileModal } from "../../components/modals/_upload-file-modal";
import { UploadFolderModal } from "../../components/modals/_upload-folder-modal";
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

    private view: HomePageView;
    private model: HomePageModel;

    public bootstrap(): void {
        this.bootstrapModel();
        this.bootstrapView();
        this.bootstrapModals();

        this.view.renderBody(this.model.getDocuments(), this.model.getSelectedDocument()?.id ?? null);
        this.view.renderBreadcrumb(this.model.getPathArr());

        this.view.bootstrap();
        this.model.bootstrap();
    }

    private bootstrapModals(): void {
        const handleModalAddFolderConfirm = (folderName: string) => {
            this.model.handleAddFolder(folderName);
        };

        const handleModalAddFileConfirm = (fileName: string, extension: string, content: string) => {
            this.model.handleAddFile(fileName, extension, content);
        };

        // TODO: Handle folder upload more detail
        const handleModalUploadFolderConfirm = (folderName: string, files: File[]) => {
            this.model.handleAddFolder(folderName);
        };

        const handleModalUploadFileConfirm = (fileName: string, extension: string, content: string) => {
            this.model.handleAddFile(fileName, extension, content);
        };

        const handleModalUpdateFileConfirm = (fileId: string, fileName: string) => {
            this.model.handleUpdateFile(fileId, fileName);
        };

        const handleModalUpdateFolderConfirm = (folderId: string, folderName: string) => {
            this.model.handleUpdateFolder(folderId, folderName);
        };

        const handleModalDeleteDocumentConfirm = (documentId: string, documentType: "folder" | "file") => {
            this.model.handleDeleteDocument(documentId);
        };

        this.addFolderModal = new AddFolderModal(handleModalAddFolderConfirm).init();
        this.addFileModal = new AddFileModal(handleModalAddFileConfirm).init();
        this.uploadFileModal = new UploadFileModal(handleModalUploadFileConfirm).init();
        this.uploadFolderModal = new UploadFolderModal(handleModalUploadFolderConfirm).init();
        this.updateFileModal = new UpdateFileModal(handleModalUpdateFileConfirm).init();
        this.updateFolderModal = new UpdateFolderModal(handleModalUpdateFolderConfirm).init();
        this.deleteDocumentModal = new DeleteDocumentModal(handleModalDeleteDocumentConfirm).init();
    }

    private bootstrapModel(): void {
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


/**
 * NOTE: Use arrow function to keep the "this" context of the controller instance when the model calls the change handlers. Otherwise, we need to bind "this" for each handler function, which is more verbose and error-prone.
 */