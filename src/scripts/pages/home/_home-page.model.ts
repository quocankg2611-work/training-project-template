import { DocumentsApi } from "../../apis/_documents.api";
import { FilesApi } from "../../apis/_files.api";
import { FolderApi } from "../../apis/_folder.api";
import { DocumentModel } from "../../models/_document.model";
import { FolderModel } from "../../models/_folder.model";
import { AuthService } from "../../services/_auth.service";

type UploadProgressHandlers = {
    onFileUploadStart: (file: File) => string;
    onFileUploadProgress: (uploadId: string, progress: number) => void;
    onFileUploadComplete: (uploadId: string) => void;
    onFileUploadFailed: (uploadId: string, errorMessage: string) => void;
};

export class HomePageModel {
    private _currentFolder: FolderModel | null;
    private _documents: DocumentModel[];
    private _isLoggedIn: boolean = false;
    private _selectedDocumentIds: Set<string>;
    private _error: string | null;
    private _isLoading: boolean;

    constructor(
        private readonly onDocumentsChange: (documents: DocumentModel[]) => void,
        private readonly onSelectedDocumentsChange: (selectedDocumentIds: string[]) => void,
        private readonly onErrorChange: (error: string | null) => void,
        private readonly onIsLoadingChange: (isLoading: boolean) => void,
        private readonly onIsLoggedInChange: (isLoggedIn: boolean) => void,
        private readonly onCurrentFolderChange?: (currentFolder: FolderModel | null) => void,
    ) {
        this._currentFolder = null;
        this._documents = [];
        this._selectedDocumentIds = new Set<string>();
        this._error = null;
        this._isLoading = false;
        this._isLoggedIn = false;
    }

    // For quick document lookup by id
    private _documentByIdMap: Record<string, DocumentModel> = {};

    private getDocumentById(id: string): DocumentModel | null {
        if (this._documentByIdMap[id]) {
            return this._documentByIdMap[id];
        }
        return null;
    }

    public bootstrap(): void {
        if (!this._isLoggedIn) {
            this.clearSelectedDocuments();
            this.setDocuments([]);
            return;
        }

        this.setIsLoading(true);
        this.setError(null);
        DocumentsApi.getByPath(this.getCurrentPath())
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

    public async initializeAuthStateAsync(): Promise<void> {
        const isLoggedIn = await AuthService.restoreSessionAsync().catch(() => false);
        this.setIsLoggedIn(isLoggedIn);

        if (isLoggedIn) {
            this.bootstrap();
            return;
        }

        this.clearSelectedDocuments();
        this.setDocuments([]);
    }

    // Getters and setters:

    public getCurrentFolder(): FolderModel | null {
        return this._currentFolder;
    }

    public getCurrentPathArr(): string[] {
        if (!this._currentFolder) {
            return [];
        }
        const currentPath = `${this._currentFolder.path}/${this._currentFolder.name}`;
        return currentPath.split("/").filter(Boolean);
    }

    public getCurrentPath(): string {
        const pathArr = this.getCurrentPathArr();
        if (pathArr.length === 0) {
            return "/";
        }
        return `/${pathArr.join("/")}`;
    }

    public getDocuments(): DocumentModel[] {
        return this._documents;
    }

    public getSelectedDocumentIds(): string[] {
        return Array.from(this._selectedDocumentIds);
    }

    public getSelectedDocumentCount(): number {
        return this._selectedDocumentIds.size;
    }

    public getSelectedDocuments(): DocumentModel[] {
        return this.getSelectedDocumentIds()
            .map((documentId) => this.getDocumentById(documentId))
            .filter((document): document is DocumentModel => document !== null);
    }

    /**
     * For editing document, only allow exactly one document to be selected, and return that document. If the selection is invalid, return null.
     * @returns 
     */
    public getSelectedDocument(): DocumentModel | null {
        if (this._selectedDocumentIds.size !== 1) {
            return null;
        }

        const ids = this.getSelectedDocumentIds();
        const selectedDocumentId = ids[0];
        if (!selectedDocumentId) {
            return null;
        }

        return this.getDocumentById(selectedDocumentId);
    }

    public getIsLoggedIn(): boolean {
        return this._isLoggedIn;
    }

    public setDocuments(documents: DocumentModel[]): void {
        this._documents = documents;
        this._documentByIdMap = {};
        for (const document of documents) {
            this._documentByIdMap[document.id] = document;
        }

        const validSelectedIds = this.getSelectedDocumentIds().filter((selectedId) => this._documentByIdMap[selectedId]);
        if (validSelectedIds.length !== this._selectedDocumentIds.size) {
            this._selectedDocumentIds = new Set(validSelectedIds);
            this.onSelectedDocumentsChange(validSelectedIds);
        }

        this.onDocumentsChange(documents);
    }

    public clearSelectedDocuments(): void {
        if (this._selectedDocumentIds.size === 0) {
            return;
        }

        this._selectedDocumentIds.clear();
        this.onSelectedDocumentsChange([]);
    }

    public setDocumentSelection(documentId: string, isSelected: boolean): void {
        if (!this.getDocumentById(documentId)) {
            return;
        }

        if (isSelected) {
            this._selectedDocumentIds.add(documentId);
        } else {
            this._selectedDocumentIds.delete(documentId);
        }

        this.onSelectedDocumentsChange(this.getSelectedDocumentIds());
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

    public setCurrentFolder(currentFolder: FolderModel | null): void {
        const hasChanged =
            this._currentFolder?.id !== currentFolder?.id ||
            this._currentFolder?.name !== currentFolder?.name ||
            this._currentFolder?.path !== currentFolder?.path;
        if (!hasChanged) {
            return;
        }

        this._currentFolder = currentFolder;
        if (this.onCurrentFolderChange) {
            this.onCurrentFolderChange(currentFolder);
        }
    }

    // ==============================
    // Services:
    // ==============================

    // Common methods:

    private _createFolderModelFromPath(pathArr: string[]): FolderModel | null {
        if (pathArr.length === 0) {
            return null;
        }

        const folderName = pathArr[pathArr.length - 1];
        const parentPathArr = pathArr.slice(0, -1);
        const parentPath = parentPathArr.length > 0 ? `/${parentPathArr.join("/")}` : "";
        return new FolderModel("", folderName, parentPath);
    }

    private async _handleRefreshCurrentFolder(): Promise<void> {
        return DocumentsApi.getByPath(this.getCurrentPath())
            .then((newDocuments) => {
                this.clearSelectedDocuments();
                this.setDocuments(newDocuments);
            })
            .catch((error) => {
                this.setError("Failed to load folder contents");
            });
    }

    private _navigateToFolder(currentFolder: FolderModel | null): void {
        this.setCurrentFolder(currentFolder);
        this.setIsLoading(true);
        this.setError(null);
        this._handleRefreshCurrentFolder().finally(() => {
            this.setIsLoading(false);
        });
    }

    // Usecase specific methods:

    public handleFolderNavigationGoBackToLevel(goBackToLevel: number): void {
        const currentPathArr = this.getCurrentPathArr();
        if (goBackToLevel < 0 || goBackToLevel > currentPathArr.length) {
            return;
        }

        const targetPathArr = currentPathArr.slice(0, goBackToLevel);
        const targetFolder = this._createFolderModelFromPath(targetPathArr);
        this._navigateToFolder(targetFolder);
    }

    public handleFolderNavigationById(folderId: string): void {
        const folderDocument = this.getDocumentById(folderId);
        if (folderDocument && folderDocument.documentType === "folder") {
            this._navigateToFolder(new FolderModel(folderDocument.id, folderDocument.name, folderDocument.path));
        }
    }

    public handleAddFolder(folderName: string): string | null {
        if (this._documents.some(doc => doc.name === folderName)) {
            return "A document with the same name already exists in the current folder";
        }
        let error: string | null = null;
        this.setIsLoading(true);
        FolderApi.create({
            name: folderName,
            parentFolderId: this._currentFolder?.id || undefined,
        }).then(() => {
            const parentPathArr = this.getCurrentPathArr();
            const parentPath = parentPathArr.length > 0 ? `/${parentPathArr.join("/")}` : "";
            this._navigateToFolder(new FolderModel("", folderName, parentPath));
        }).catch((error) => {
            error = "Failed to create folder";
        }).finally(() => {
            this.setIsLoading(false);
        });
        return error;
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
        const containingPath = this.getCurrentPath();
        this.setIsLoading(true);

        let sucessCount = 0;

        FilesApi.uploadMany({
            basePath: containingPath,
            files,
            onUploadComplete: (index, isSuccess) => {
                const file = files[index];
                if (file) {
                    const uploadId = progressHandlers.onFileUploadStart(file);
                    if (isSuccess) {
                        progressHandlers.onFileUploadComplete(uploadId);
                    } else {
                        progressHandlers.onFileUploadFailed(uploadId, `Failed to upload '${file.name}'`);
                    }
                }
                sucessCount += 1;
                if (sucessCount === files.length) {
                    this._handleRefreshCurrentFolder().finally(() => {
                        this.setIsLoading(false);
                    });
                }
            },
            onUploadProgress: (index, progress) => {
                const file = files[index];
                if (file) {
                    const uploadId = progressHandlers.onFileUploadStart(file);
                    progressHandlers.onFileUploadProgress(uploadId, progress);
                }
            },
        }).then(() => {
            this._handleRefreshCurrentFolder().finally(() => {
                this.setIsLoading(false);
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
        this.setIsLoading(true);
        FilesApi.update({
            id: fileId,
            name: fileName,
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
        FolderApi.update({
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

    public handleDeleteDocuments(documentIds: string[]): string | null {
        if (documentIds.length === 0) {
            return "Please select at least one document";
        }

        const uniqueDocumentIds = Array.from(new Set(documentIds));
        const selectedDocuments = uniqueDocumentIds
            .map((documentId) => this.getDocumentById(documentId))
            .filter((document): document is DocumentModel => document !== null);

        if (selectedDocuments.length === 0) {
            return "Document not found";
        }

        const fileIds = selectedDocuments
            .filter((document) => document.documentType === "file")
            .map((document) => document.id);
        const folderIds = selectedDocuments
            .filter((document) => document.documentType === "folder")
            .map((document) => document.id);

        let error: string | null = null;
        this.setIsLoading(true);

        const deleteTasks: Promise<unknown>[] = [];
        if (fileIds.length > 0) {
            deleteTasks.push(FilesApi.delete(fileIds));
        }
        if (folderIds.length > 0) {
            deleteTasks.push(FolderApi.delete(folderIds));
        }

        Promise.all(deleteTasks)
            .catch(() => {
                error = "Failed to delete selected documents";
            })
            .finally(() => {
                this._handleRefreshCurrentFolder().finally(() => {
                    this.setIsLoading(false);
                });
            });

        return error;
    }

    public async handleLogin(): Promise<void> {
        this.setError(null);

        return AuthService.loginAsync()
            .then(() => {
                this.setIsLoggedIn(true);
                this.bootstrap();
            })
            .catch(() => {
                this.setIsLoggedIn(false);
                this.setError("Login failed");
            });
    }

    public async handleLogout(): Promise<void> {
        this.setError(null);

        return AuthService.logoutAsync()
            .then(() => {
                this.setIsLoggedIn(false);
                this.bootstrap();
            })
            .catch(() => {
                this.setError("Logout failed");
            });
    }
}

