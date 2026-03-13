import { DocumentApi, DocumentResponse } from "../../apis/_document.api";
import { FolderApi } from "../../apis/_folder.api";

export class HomePageModel {

    private pathArr: string[];
    private documents: DocumentResponse[];
    private selectedDocument: DocumentResponse | null
    private error: string | null;
    private isLoading: boolean;

    constructor(
        private readonly onPathArrChange: (pathArr: string[]) => void,
        private readonly onDocumentsChange: (documents: DocumentResponse[]) => void,
        private readonly onSelectedDocumentChange: (selectedDocument: DocumentResponse | null) => void,
        private readonly onErrorChange: (error: string | null) => void,
        private readonly onIsLoadingChange: (isLoading: boolean) => void,
    ) {
        this.pathArr = [];
        this.documents = [];
        this.selectedDocument = null;
        this.error = null;
        this.isLoading = false;
    }

    // For quick document lookup by id
    private _documentByIdMap: Record<string, DocumentResponse> = {};

    public getPathArr(): string[] {
        return this.pathArr;
    }

    public getDocuments(): DocumentResponse[] {
        return this.documents;
    }

    public getSelectedDocument(): DocumentResponse | null {
        return this.selectedDocument;
    }

    public getError(): string | null {
        return this.error;
    }

    public getIsLoading(): boolean {
        return this.isLoading;
    }

    public getDocumentById(id: string): DocumentResponse | null {
        if (this._documentByIdMap[id]) {
            return this._documentByIdMap[id];
        }
        return null;
    }

    public setPathArr(pathArr: string[]): void {
        this.pathArr = pathArr;
        this.onPathArrChange(pathArr);
    }

    public setDocuments(documents: DocumentResponse[]): void {
        this.documents = documents;
        this._documentByIdMap = {};
        for (const document of documents) {
            this._documentByIdMap[document.id] = document;
        }
        this.onDocumentsChange(documents);
    }

    public setSelectedDocument(selectedDocument: DocumentResponse | null): void {
        this.selectedDocument = selectedDocument;
        this.onSelectedDocumentChange(selectedDocument);
    }

    public setSelectedDocumentById(documentId: string | null): void {
        if (documentId === null) {
            this.setSelectedDocument(null);
        } else {
            const document = this.getDocumentById(documentId);
            this.setSelectedDocument(document);
        }
    }

    public setError(error: string | null): void {
        this.error = error;
        this.onErrorChange(error);
    }

    public setIsLoading(isLoading: boolean): void {
        this.isLoading = isLoading;
        this.onIsLoadingChange(isLoading);
    }

    // Services:


    public handleFolderNavigationByName(folderName: string): void {
        const newPathArr = [...this.pathArr, folderName];
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
        if (this.documents.some(doc => doc.name === folderName)) {
            this.setError("A document with the same name already exists in the current folder");
            return;
        }
        this.setError(null);
        this.setIsLoading(true);
        FolderApi.createFolder({
            name: folderName,
            path: this.pathArr.join("/"),
            modifiedBy: "Current User", // TODO: Get current user
        }).then(() => {
            // Refresh the folder contents after creating the new folder
            return DocumentApi.getDocumentsByPath(this.pathArr);
        }).then((newDocuments) => {
            this.setDocuments(newDocuments);
        }).catch((error) => {
            this.setError("Failed to create folder");
        }).finally(() => {
            this.setIsLoading(false);
        });

    }



}

