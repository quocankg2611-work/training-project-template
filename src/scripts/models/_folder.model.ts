import { fileNameInvalidCharsRegex } from "../utilities/_regex";

export class FolderModelValidator {
    public static validateName(folderName: string): string | null {
        if (!folderName || folderName.trim() === "") {
            return "Folder name cannot be empty.";
        } else if (folderName.length > 40) {
            return "Folder name cannot exceed 40 characters.";
        } else if (fileNameInvalidCharsRegex.test(folderName)) {
            return "Folder name cannot contain the following characters: \\ / : * ? \" < > |";
        }
        return null;
    }
}