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
}