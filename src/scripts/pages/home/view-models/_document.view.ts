import { DocumentResponse } from "../../../apis/_document.api";
import { FolderModel } from "../../../model/_folder.model";
import formatTimeAgo from "../../../utilities/_format-strings";

export class HomePageDocumentView {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly modifiedMs: number,
        public readonly modifiedTimeAgo: string,
        public readonly modifiedBy: string,
        public readonly documentType: "folder" | "file",
        public readonly fileType: string | null,
    ) { }

    public static fromDocumentResponse(response: DocumentResponse, onFolderClicked: (folder: FolderModel) => void): HomePageDocumentView {
        if (response.documentType === "file") {
            return new HomePageDocumentView(
                response.id,
                response.name,
                new Date(response.modified).getTime(),
                formatTimeAgo(response.modified),
                response.modifiedBy,
                "file",
                response.fileType ?? null,
            );
        } else {
            return new HomePageDocumentView(
                response.id,
                response.name,
                new Date(response.modified).getTime(),
                formatTimeAgo(response.modified),
                response.modifiedBy,
                "folder",
                "folder",
            );
        }
    }
}


// export function documentViewFromFileModel(file: FileModel): HomePageDocumentView {
//     const iconName = FileExtensionToIconName.get(file.extension) ?? null;
//     return {
//         ...file,
//         modifiedMs: new Date(file.modified).getTime(),
//         modifiedStr: formatTimeAgo(file.modified),
//         documentType: "file",
//         iconName: iconName
//     };
// }

// export function documentViewFromFolderModel(folder: FolderModel, onFolderClicked: (folder: FolderModel) => void): HomePageDocumentView {
//     return {
//         ...folder,
//         modifiedMs: new Date(folder.modified).getTime(),
//         modifiedStr: formatTimeAgo(folder.modified),
//         documentType: "folder",
//         iconName: "folder",
//         onDocumentClicked: () => onFolderClicked(folder)
//     };
// }
