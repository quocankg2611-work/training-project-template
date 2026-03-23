import { AuthService } from "../../services/_auth.service";
import { DocumentService, DocumentResponse } from "../../services/_document.service";
import { FileService } from "../../services/_file.service";
import { FolderService } from "../../services/_folder.service";

type UploadProgressHandlers = {
    onFileUploadStart: (file: File) => string;
    onFileUploadProgress: (uploadId: string, progress: number) => void;
    onFileUploadComplete: (uploadId: string) => void;
    onFileUploadFailed: (uploadId: string, errorMessage: string) => void;
};

export class HomePageModel {
    private _pathArr: string[];
    private _documents: DocumentResponse[];
    private _isLoggedIn: boolean = false;
    private _selectedDocument: DocumentResponse | null
    private _error: string | null;
    private _isLoading: boolean;

    private readonly _authService: AuthService;

    constructor(
        private readonly onPathArrChange: (pathArr: string[]) => void,
        private readonly onDocumentsChange: (documents: DocumentResponse[]) => void,
        private readonly onSelectedDocumentChange: (selectedDocument: DocumentResponse | null) => void,
        private readonly onErrorChange: (error: string | null) => void,
        private readonly onIsLoadingChange: (isLoading: boolean) => void,
        private readonly onIsLoggedInChange: (isLoggedIn: boolean) => void,
    ) {
        this._pathArr = [];
        this._documents = [];
        this._selectedDocument = null;
        this._error = null;
        this._isLoading = false;
        this._isLoggedIn = false;

        this._authService = new AuthService();
    }

    // For quick document lookup by id
    private _documentByIdMap: Record<string, DocumentResponse> = {};

    private getDocumentById(id: string): DocumentResponse | null {
        if (this._documentByIdMap[id]) {
            return this._documentByIdMap[id];
        }
        return null;
    }

    public bootstrap(): void {
        this.setIsLoading(true);
        this.setError(null);
        DocumentService.getDocumentsByPath(this._pathArr)
            .then((documents) => {
                this.setDocuments(documents);
            })
            .catch((error) => {
                this.setError("Failed to load folder contents");
            })
            .finally(() => {
                this.setIsLoading(false);
            });
    }

    // Getters and setters:

    public getPathArr(): string[] {
        return this._pathArr;
    }

    public getDocuments(): DocumentResponse[] {
        return this._documents;
    }

    public getSelectedDocument(): DocumentResponse | null {
        return this._selectedDocument;
    }

    public getIsLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    public setPathArr(pathArr: string[]): void {
        if (pathArr.join("/") !== this._pathArr.join("/")) {
            this._pathArr = pathArr;
            this.onPathArrChange(pathArr);
        }
    }

    public setDocuments(documents: DocumentResponse[]): void {
        this._documents = documents;
        this._documentByIdMap = {};
        for (const document of documents) {
            this._documentByIdMap[document.id] = document;
        }
        this.onDocumentsChange(documents);
    }

    public setSelectedDocument(selectedDocument: DocumentResponse | null): void {
        this._selectedDocument = selectedDocument;
        this.onSelectedDocumentChange(selectedDocument);
    }

    public setSelectedDocumentById(documentId: string | null): void {
        if (documentId !== this._selectedDocument?.id) {
            if (documentId === null) {
                this.setSelectedDocument(null);
            } else {
                const document = this.getDocumentById(documentId);
                this.setSelectedDocument(document);
            }
        }
    }

    public setError(error: string | null): void {
        if (error !== this._error) {
            this._error = error;
            this.onErrorChange(error);
        }
    }

    public setIsLoading(isLoading: boolean): void {
        if (isLoading !== this._isLoading) {
            this._isLoading = isLoading;
            this.onIsLoadingChange(isLoading);
        }
    }

    public setIsLoggedIn(isLoggedIn: boolean): void {
        if (isLoggedIn !== this._isLoggedIn) {
            this._isLoggedIn = isLoggedIn;
            this.onIsLoggedInChange(isLoggedIn);
        }
    }

    // ==============================
    // Services:
    // ==============================

    // Common methods:

    private async _handleFolderNavigationByName(folderName: string): Promise<void> {
        const newPathArr = [...this._pathArr, folderName];
        return this.handleFolderNavigation(newPathArr);
    }

    private async _handleRefreshCurrentFolder(): Promise<void> {
        return DocumentService.getDocumentsByPath(this.getPathArr())
            .then((newDocuments) => {
                this.setSelectedDocument(null);
                this.setDocuments(newDocuments);
            })
            .catch((error) => {
                this.setError("Failed to load folder contents");
            });
    }

    // Usecase specific methods:

    public handleFolderNavigation(pathArr: string[]) {
        this.setPathArr(pathArr);
        this.setIsLoading(true);
        this.setError(null);
        this._handleRefreshCurrentFolder().finally(() => {
            this.setIsLoading(false);
        });
    }

    public handleFolderNavigationGoBackToLevel(goBackToLevel: number): void {
        if (goBackToLevel < 0 || goBackToLevel >= this._pathArr.length) {
            return;
        }
        const newPathArr = this._pathArr.slice(0, goBackToLevel);
        this.handleFolderNavigation(newPathArr);
    }

    public handleFolderNavigationById(folderId: string): void {
        const folderDocument = this.getDocumentById(folderId);
        if (folderDocument && folderDocument.documentType === "folder") {
            this._handleFolderNavigationByName(folderDocument.name);
        }
    }

    public handleAddFolder(folderName: string): string | null {
        if (this._documents.some(doc => doc.name === folderName)) {
            return "A document with the same name already exists in the current folder";
        }
        let error: string | null = null;
        this.setIsLoading(true);
        const path = this._pathArr.join("/");
        FolderService.createFolder({
            name: folderName,
            containingPath: path,
            modifiedBy: "Current User", // TODO: Get current user
        }).then(() => {
            this._handleFolderNavigationByName(folderName);
        }).catch((error) => {
            error = "Failed to create folder";
        }).finally(() => {
            this.setIsLoading(false);
        });
        return error;
    }

    public handleAddFile(fileName: string, extension: string, content: string): string | null {
        if (this._documents.some(doc => doc.name === fileName && doc.documentType === "file")) {
            return "A file with the same name already exists in the current folder";
        }
        let error: string | null = null;
        this.setIsLoading(true);
        const path = this._pathArr.join("/");
        FileService.createFile({
            name: fileName,
            fileType: extension,
            content: content,
            containingPath: path,
            modifiedBy: "Current User" // TODO: Get current user
        }).catch((error) => {
            error = "Failed to create file";
        }).finally(() => {
            this._handleRefreshCurrentFolder().finally(() => {
                this.setIsLoading(false);
            });
        });
        return error;
    }

    public handleUploadFolder(folderName: string, files: File[]): string | null {
        return "Not implemented yet";
    }

    public handleUploadFiles(files: File[], progressHandlers: UploadProgressHandlers): string | null {
        if (files.length === 0) {
            return "Please select at least one file";
        }

        const existingFileNames = this._documents
            .filter((doc) => doc.documentType === "file")
            .map((doc) => doc.name);

        const selectedFileNames = files.map((file) => file.name);
        const duplicateNameInFolder = selectedFileNames.find((name) => existingFileNames.includes(name));
        if (duplicateNameInFolder) {
            return `A file named '${duplicateNameInFolder}' already exists in the current folder`;
        }

        const uniqueSelectedNames = new Set(selectedFileNames);
        if (uniqueSelectedNames.size !== selectedFileNames.length) {
            return "Selected files contain duplicate names";
        }

        const containingPath = this._pathArr.join("/");
        this.setIsLoading(true);

        const filesUploadStatus: {
            [uploadId: string]: "success" | "failed" | "pending";
        } = {};

        function checkAllUploadsCompleted() {
            const allCompleted = Object.values(filesUploadStatus).every(status => status === "success" || status === "failed");
            if (allCompleted) {
                this._handleRefreshCurrentFolder().finally(() => {
                    this.setIsLoading(false);
                });
            }
        }

        files.forEach(async (file) => {
            const uploadId = progressHandlers.onFileUploadStart(file);
            filesUploadStatus[uploadId] = "pending";
            FileService.uploadFile(
                containingPath,
                file,
                (progress) => {
                    if (uploadId) {
                        progressHandlers.onFileUploadProgress(uploadId, progress);
                    }
                },
                () => {
                    if (uploadId) {
                        progressHandlers.onFileUploadComplete(uploadId);
                        filesUploadStatus[uploadId] = "success";
                        checkAllUploadsCompleted.call(this);
                    }
                }
            ).catch(() => {
                if (uploadId) {
                    progressHandlers.onFileUploadFailed(uploadId, `Failed to upload '${file.name}'`);
                    filesUploadStatus[uploadId] = "failed";
                    checkAllUploadsCompleted.call(this);
                }
            });
        });

        return null;
    }

    public handleUpdateFile(fileId: string, fileName: string): string | null {
        const fileDocument = this.getDocumentById(fileId);
        if (!fileDocument || fileDocument.documentType !== "file") {
            return "File not found";
        }
        if (this._documents.some(doc => doc.name === fileName && doc.documentType === "file" && doc.id !== fileId)) {
            return "A file with the same name already exists in the current folder";
        }
        let error: string | null = null;
        this.setIsLoading(true);
        FileService.updateFile({
            id: fileId,
            name: fileName,
            fileType: fileDocument.fileType,
        }).catch((error) => {
            error = "Failed to update file";
        }).finally(() => {
            this._handleRefreshCurrentFolder().finally(() => {
                this.setIsLoading(false);
            });
        });
    }

    public handleUpdateFolder(folderId: string, folderName: string): string | null {
        const folderDocument = this.getDocumentById(folderId);
        if (!folderDocument || folderDocument.documentType !== "folder") {
            return "Folder not found";
        }
        if (folderName.trim() === "") {
            return "Folder name cannot be empty";
        }
        if (this._documents.some(doc => doc.name === folderName && doc.documentType === "folder" && doc.id !== folderId)) {
            return "A folder with the same name already exists in the current folder";
        }
        let error: string | null = null;
        this.setIsLoading(true);
        FolderService.updateFolder({
            id: folderId,
            name: folderName,
        }).catch((error) => {
            error = "Failed to update folder";
        }).finally(() => {
            this._handleRefreshCurrentFolder().finally(() => {
                this.setIsLoading(false);
            });
        });
        return error;
    }

    public handleDeleteDocument(documentId: string): string | null {
        const document = this.getDocumentById(documentId);
        if (!document) {
            return "Document not found";
        }
        let error: string | null = null;
        this.setIsLoading(true);
        if (document.documentType === "file") {
            FileService.deleteFile(documentId).catch((error) => {
                error = "Failed to delete file";
            }).finally(() => {
                this._handleRefreshCurrentFolder().finally(() => {
                    this.setIsLoading(false);
                });
            });
        } else if (document.documentType === "folder") {
            FolderService.deleteFolder(documentId).catch((error) => {
                error = "Failed to delete folder";
            }).finally(() => {
                this._handleRefreshCurrentFolder().finally(() => {
                    this.setIsLoading(false);
                });
            });

        }
        return error;
    }

    public handleLogin(): void {
        // this._authService.loginPopup();
        AuthService.initializeAsync().then((msalInstance) => {
            msalInstance.loginPopup({
                scopes: ["User.Read"],
                redirectUri: "/redirect.html",
            }).then((loginResponse) => {
                msalInstance.setActiveAccount(loginResponse.account);
                this.setIsLoggedIn(true);
            });
        });
    }
}

