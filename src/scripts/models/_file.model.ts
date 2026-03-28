import { fileNameInvalidCharsRegex } from "../utilities/_regex";

export class FileModelValidator {
    public static validateName(fileName: string): string | null {
        if (!fileName || fileName.trim() === "") {
            return "File name cannot be empty.";
        } else if (fileName.length > 40) {
            return "File name cannot exceed 40 characters.";
        } else if (fileNameInvalidCharsRegex.test(fileName)) {
            return "File name cannot contain the following characters: \\ / : * ? \" < > |";
        }
        return null;
    }

    public static validateType(fileType: string): string | null {
        if (!fileType || fileType.trim() === "") {
            return "Please select a file type.";
        }
        return null;
    }

    public static validateFiles(files: File[], isUploadFolder: boolean): string | null {
        if (!files || files.length === 0) {
            return "Please select at least one file to upload.";
        }
        const distinctFileNameSet = new Set<string>();
        if (isUploadFolder === true) {
            for (const file of files) {
                if (distinctFileNameSet.has(file.webkitRelativePath)) {
                    return "Duplicate file names are not allowed in the upload folder.";
                }
                distinctFileNameSet.add(file.webkitRelativePath);
            }
        }
        else {
            for (const file of files) {
                if (distinctFileNameSet.has(file.name)) {
                    return "Duplicate file names are not allowed.";
                }
                distinctFileNameSet.add(file.name);
            }
        }
        return null;
    }

    public static validateRawFiles(
        files: File[],
    ): string | null {
        if (!files || files.length === 0) {
            return "Please select at least one file to upload.";
        }
        return null;
    }
}

export class FileModel {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly extension: string,
        public readonly sizeBytes: number,
        public readonly path: string,
        public readonly createdAt: string,
        public readonly createdByName: string,
        public readonly updatedAt: string,
        public readonly updatedByName: string,
    ) { }
}
