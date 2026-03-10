/**
 * Sets up the "Upload File" modal interaction.
 *
 * @param onUploadFile - Callback invoked with the file name, extension, and file content.
 *                       Implement the actual file upload logic here.
 */
export default function setupUploadFileModal(
    onUploadFile: (fileName: string, extension: string, content: string) => void
): void {
    const modalEl = document.getElementById("uploadFileModal")!;
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    const fileInputError = document.getElementById("fileInputError")!;
    const uploadedFileGroup = document.getElementById("uploadedFileGroup")!;
    const uploadedFileName = document.getElementById("uploadedFileName") as HTMLInputElement;
    const fileNameGroup = document.getElementById("fileNameGroup")!;
    const fileNameInput = document.getElementById("fileNameInput") as HTMLInputElement;
    const fileNameError = document.getElementById("fileNameError")!;
    const uploadBtn = document.getElementById("uploadFileBtn") as HTMLButtonElement;

    const ALLOWED_EXTENSIONS = ["docx", "xlsx"];

    let fileContent = "";
    let fileExtension = "";

    // Reset form state when modal is opened
    modalEl.addEventListener("show.bs.modal", () => {
        fileInput.value = "";
        fileInput.classList.remove("is-invalid");
        fileInputError.style.display = "none";
        uploadedFileGroup.style.display = "none";
        uploadedFileName.value = "";
        fileNameGroup.style.display = "none";
        fileNameInput.value = "";
        fileNameInput.classList.remove("is-invalid");
        fileNameError.style.display = "none";
        fileContent = "";
        fileExtension = "";
    });

    // When a file is selected, read its content and show name fields
    fileInput.addEventListener("change", () => {
        if (!fileInput.files || fileInput.files.length === 0) return;

        const file = fileInput.files[0];
        const dotIndex = file.name.lastIndexOf(".");
        const ext = dotIndex > 0 ? file.name.substring(dotIndex + 1).toLowerCase() : "";

        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            fileInput.classList.add("is-invalid");
            fileInputError.textContent = "Only .docx and .xlsx files are allowed.";
            fileInputError.style.display = "block";
            uploadedFileGroup.style.display = "none";
            fileNameGroup.style.display = "none";
            fileContent = "";
            fileExtension = "";
            return;
        }

        fileInput.classList.remove("is-invalid");
        fileInputError.style.display = "none";

        const baseName = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;
        fileExtension = ext;

        // Show the original file name as readonly
        uploadedFileName.value = file.name;
        uploadedFileGroup.style.display = "block";

        // Pre-fill the editable file name
        fileNameInput.value = baseName;
        fileNameGroup.style.display = "block";

        // Read the file content as text
        const reader = new FileReader();
        reader.onload = () => {
            fileContent = reader.result as string;
        };
        reader.readAsText(file);
    });

    // Clear file name validation on input
    fileNameInput.addEventListener("input", () => {
        if (fileNameInput.value.trim()) {
            fileNameInput.classList.remove("is-invalid");
            fileNameError.style.display = "none";
        }
    });

    // Validate and submit
    uploadBtn.addEventListener("click", () => {
        let hasError = false;

        if (!fileInput.files || fileInput.files.length === 0) {
            fileInput.classList.add("is-invalid");
            fileInputError.textContent = "Please select a file to upload.";
            fileInputError.style.display = "block";
            hasError = true;
        }

        const fileName = fileNameInput.value.trim();
        if (!fileName) {
            fileNameInput.classList.add("is-invalid");
            fileNameError.style.display = "block";
            hasError = true;
        }

        if (hasError) return;

        onUploadFile(fileName, fileExtension, fileContent);

        const bsModal = (window as any).bootstrap.Modal.getInstance(modalEl);
        bsModal?.hide();
    });
}