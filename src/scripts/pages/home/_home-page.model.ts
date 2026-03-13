import { DocumentApi, DocumentResponse } from "../../apis/_document.api";
import { FileApi } from "../../apis/_file.api";
import { FolderApi } from "../../apis/_folder.api";

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

    // Services:

    public handleFolderNavigationByName(folderName: string): void {
        const newPathArr = [...this._pathArr, folderName];
        this.setPathArr(newPathArr);
        this.setIsLoading(true);
        this.setError(null);
        DocumentApi.getDocumentsByPath(newPathArr)
            .then((newDocuments) => {
                this.setSelectedDocument(null);
                this.setDocuments(newDocuments);
            })
            .catch((error) => {
                this.setError("Failed to load folder contents");
            })
            .finally(() => {
                this.setIsLoading(false);
            });
        ;
    }

    public handleFolderNavigationById(folderId: string): void {
        const folderDocument = this.getDocumentById(folderId);
        if (folderDocument && folderDocument.documentType === "folder") {
            this.handleFolderNavigationByName(folderDocument.name);
        }
    }

    public handleAddFolder(folderName: string): void {
        if (folderName.trim() === "") {
            this.setError("Folder name cannot be empty");
            return;
        }
        if (folderName.includes("/")) {
            this.setError("Folder name cannot contain slashes");
            return;
        }
        if (this._documents.some(doc => doc.name === folderName)) {
            this.setError("A document with the same name already exists in the current folder");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        const path = this._pathArr.join("/");
        FolderApi.createFolder({
            name: folderName,
            path: path,
            modifiedBy: "Current User", // TODO: Get current user
        }).then(() => {
            this.handleFolderNavigationByName(folderName);
        }).catch((error) => {
            this.setError("Failed to create folder");
        }).finally(() => {
            this.setIsLoading(false);
        });
    }

    public handleAddFile(fileName: string, extension: string, content: string): void {
        if (fileName.trim() === "") {
            this.setError("File name cannot be empty");
            return;
        }
        if (fileName.includes("/")) {
            this.setError("File name cannot contain slashes");
            return;
        }
        if (this._documents.some(doc => doc.name === fileName && doc.documentType === "file")) {
            this.setError("A file with the same name already exists in the current folder");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        const path = this._pathArr.join("/");
        FileApi.createFile({
            name: fileName,
            extension: extension,
            content: content,
            path: path,
            modifiedBy: "Current User" // TODO: Get current user
        }).catch((error) => {
            this.setError("Failed to create file");
        }).finally(() => {
            this.setIsLoading(false);
        });
    }

    public handleUpdateFile(fileId: string, fileName: string): void {
        const fileDocument = this.getDocumentById(fileId);
        if (!fileDocument || fileDocument.documentType !== "file") {
            this.setError("File not found");
            return;
        }
        if (fileName.trim() === "") {
            this.setError("File name cannot be empty");
            return;
        }
        if (this._documents.some(doc => doc.name === fileName && doc.documentType === "file" && doc.id !== fileId)) {
            this.setError("A file with the same name already exists in the current folder");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        FileApi.updateFile({
            id: fileId,
            name: fileName,
            extension: fileDocument.fileType,
        }).catch((error) => {
            this.setError("Failed to update file");
        }).finally(() => {
            this.setIsLoading(false);
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
        FolderApi.updateFolder({
            id: folderId,
            name: folderName,
        }).catch((error) => {
            this.setError("Failed to update folder");
        }).finally(() => {
            this.setIsLoading(false);
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
            FileApi.deleteFile(documentId).catch((error) => {
                this.setError("Failed to delete file");
            }).finally(() => {
                this.setIsLoading(false);
            });
        } else if (document.documentType === "folder") {
            FolderApi.deleteFolder(documentId).catch((error) => {
                this.setError("Failed to delete folder");
            }).finally(() => {
                this.setIsLoading(false);
            });

        }
    }
}

