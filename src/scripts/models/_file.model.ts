import { fileNameInvalidCharsRegex } from "../utilities/_regex";

export class FileModelValidator {
    public static ALLOWED_EXTENSIONS = [
    "docx",
    "xlsx",
    "pdf",
    "txt",
    "csv",
];

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

    public static validateRawFiles(
        files: File[],
    ): string | null {
        if (!files || files.length === 0) {
            return "Please select at least one file to upload.";
        }
        const invalidFiles = files.filter((file) => {
            const ext = file.name.split(".").pop()?.toLowerCase() || "";
            return !this.ALLOWED_EXTENSIONS.includes(ext);
        });
        if (invalidFiles.length > 0) {
            return `The following files have invalid types: ${invalidFiles.map(f => f.name).join(", ")}. Allowed extensions are: ${this.ALLOWED_EXTENSIONS.join(", ")}.`;
        }
        return null;
    }
}