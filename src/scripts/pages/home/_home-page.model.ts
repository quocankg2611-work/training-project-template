import { DocumentService, DocumentResponse } from "../../services/_document.service";
import { FileService } from "../../services/_file.service";
import { FolderService } from "../../services/_folder.service";

export class HomePageModel {
    private _pathArr: string[];
    private _documents: DocumentResponse[];
    private _selectedDocument: DocumentResponse | null
    private _error: string | null;
    private _isLoading: boolean;

    constructor(
        private readonly onPathArrChange: (pathArr: string[]) => void,
        private readonly onDocumentsChange: (documents: DocumentResponse[]) => void,
        private readonly onSelectedDocumentChange: (selectedDocument: DocumentResponse | null) => void,
        private readonly onErrorChange: (error: string | null) => void,
        private readonly onIsLoadingChange: (isLoading: boolean) => void,
    ) {
        this._pathArr = [];
        this._documents = [];
        this._selectedDocument = null;
        this._error = null;
        this._isLoading = false;
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

    public handleUpdateFile(fileId: string, fileName: string): void {
        const fileDocument = this.getDocumentById(fileId);
        if (!fileDocument || fileDocument.documentType !== "file") {
            this.setError("File not found");
            return;
        }
        if (this._documents.some(doc => doc.name === fileName && doc.documentType === "file" && doc.id !== fileId)) {
            this.setError("A file with the same name already exists in the current folder");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        FileService.updateFile({
            id: fileId,
            name: fileName,
            fileType: fileDocument.fileType,
        }).catch((error) => {
            this.setError("Failed to update file");
        }).finally(() => {
            this._handleRefreshCurrentFolder().finally(() => {
                this.setIsLoading(false);
            });
        });
    }

    public handleUpdateFolder(folderId: string, folderName: string): void {
        const folderDocument = this.getDocumentById(folderId);
        if (!folderDocument || folderDocument.documentType !== "folder") {
            this.setError("Folder not found");
            return;
        }
        if (folderName.trim() === "") {
            this.setError("Folder name cannot be empty");
            return;
        }
        if (this._documents.some(doc => doc.name === folderName && doc.documentType === "folder" && doc.id !== folderId)) {
            this.setError("A folder with the same name already exists in the current folder");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        FolderService.updateFolder({
            id: folderId,
            name: folderName,
        }).catch((error) => {
            this.setError("Failed to update folder");
        }).finally(() => {
            this._handleRefreshCurrentFolder().finally(() => {
                this.setIsLoading(false);
            });
        });
    }

    public handleDeleteDocument(documentId: string): void {
        const document = this.getDocumentById(documentId);
        if (!document) {
            this.setError("Document not found");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        if (document.documentType === "file") {
            FileService.deleteFile(documentId).catch((error) => {
                this.setError("Failed to delete file");
            }).finally(() => {
                this._handleRefreshCurrentFolder().finally(() => {
                    this.setIsLoading(false);
                });
            });
        } else if (document.documentType === "folder") {
            FolderService.deleteFolder(documentId).catch((error) => {
                this.setError("Failed to delete folder");
            }).finally(() => {
                this._handleRefreshCurrentFolder().finally(() => {
                    this.setIsLoading(false);
                });
            });

        }
    }
}

