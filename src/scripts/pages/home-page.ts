import renderTable from '../components/_table';
import renderCardList from '../components/_card-list';
import { onAppBeforeUnload, onAppReady } from '../utilities/_events';
import DocumentService from '../services/_document.service';
import { FolderModel } from '../model/_folder.model';
import renderBreadcrumb from '../components/_breadcrumb';
import setupAddFolderModal from '../components/_add-folder-modal';
import setupUploadFileModal from '../components/_upload-file-modal';
import setupUpdateFolderModal from '../components/_update-folder-modal';
import { FileModel } from '../model/_file.model';
import { FileExtensionsType } from '../types/_file-extensions.types';
import { DocumentView } from '../components/views/_document.view';
import setupUpdateFileModal from '../components/_update-file-modal';
import setupDeleteDocumentModal from '../components/_delete-document-modal';

onAppReady(async () => {

	const documentService = new DocumentService();
	let selectedItem: DocumentView | null = null;
	documentService.seedDataIfNotExists();

	renderHomePageIsLoading(true);

	const rootFolder = await documentService.getRootFolder();
	const folderStack: FolderModel[] = [rootFolder];
	const folderRef = () => folderStack[folderStack.length - 1];

	renderHomePageIsLoading(false);

	render();

	document.getElementById("editBtn")!.addEventListener("click", () => {
		onEditSelectedItem();
	});

	document.getElementById("deleteBtn")!.addEventListener("click", () => {
		onDeleteSelectedItem();
	});

	setupAddFolderModal((folderName: string) => {
		const newFolder: FolderModel = {
			id: crypto.randomUUID(),
			modified: new Date(),
			name: folderName,
			modifiedBy: "Current User",
			subFolders: [],
			files: [],
		};
		folderRef().subFolders.push(newFolder);
		render();
	});

	const updateFolderModal = setupUpdateFolderModal((folderId: string, folderName: string) => {
		const folder = folderRef().subFolders.find(f => f.id === folderId);
		if (folder) {
			folder.name = folderName;
			folder.modified = new Date();
			folder.modifiedBy = "Current User";
			selectedItem = null;
			render();
		}
	});

	const updateFileModal = setupUpdateFileModal((fileId: string, fileName: string) => {
		const file = folderRef().files.find(f => f.id === fileId);
		if (file) {
			file.name = fileName;
			file.modified = new Date();
			file.modifiedBy = "Current User";
			selectedItem = null;
			render();
		}
	});

	const deleteDocumentModal = setupDeleteDocumentModal((documentId: string, documentType: "folder" | "file") => {
		if (documentType === "folder") {
			folderRef().subFolders = folderRef().subFolders.filter(f => f.id !== documentId);
		} else {
			folderRef().files = folderRef().files.filter(f => f.id !== documentId);
		}
		selectedItem = null;
		render();
	});

	setupUploadFileModal((fileName: string, extension: string, content: string) => {
		const newFile: FileModel = {
			id: crypto.randomUUID(),
			modified: new Date(),
			name: fileName,
			modifiedBy: "Current User",
			extension: extension as FileExtensionsType,
			content,
		};
		folderRef().files.push(newFile);
		render();
	});

	onAppBeforeUnload(() => {
		documentService.saveRootFolder(rootFolder);
	});

	// ===============================
	// View
	// ===============================

	function render() {
		renderBreadcrumb(folderStack, (selectedFolder) => navigateBackOnFolderStack(folderStack, selectedFolder.id) && render());
		renderTable(
			folderRef(),
			(selectedFolder) => navigateIntoFolderStack(folderStack, selectedFolder.id) && render(),
			selectedItem,
			(item) => onItemSelected(item) && render()
		);
		renderCardList(folderRef(), (selectedFolder) => navigateIntoFolderStack(folderStack, selectedFolder.id) && render());
		renderHomePageIsEditing(selectedItem);
	}

	document.getElementById("cancelBtn")!.addEventListener("click", () => {
		selectedItem = null;
		renderHomePageIsEditing(selectedItem);
		render();
	});

	// ===============================
	// Model
	// ===============================

	function navigateBackOnFolderStack(folderStack: FolderModel[], targetFolderId: string): boolean {
		const index = folderStack.findIndex(f => f.id === targetFolderId);
		if (index !== -1) {
			folderStack.splice(index + 1);
			return true;
		}
		return false;
	}

	function navigateIntoFolderStack(folderStack: FolderModel[], targetFolderId: string): boolean {
		const currentFolder = folderStack[folderStack.length - 1];
		const targetFolder = currentFolder.subFolders.find(f => f.id === targetFolderId);
		if (targetFolder) {
			folderStack.push(targetFolder);
			return true;
		}
		return false;
	}

	function onItemSelected(item: DocumentView): boolean {
		selectedItem = item;
		return true;
	}

	function onEditSelectedItem(): boolean {
		if (!selectedItem) return false;
		if (selectedItem && selectedItem.documentType === "folder") {
			updateFolderModal.open(selectedItem.id, selectedItem.name);
		} else {
			updateFileModal.open(selectedItem.id, selectedItem.name);
		}
		return false;
	}

	function onDeleteSelectedItem(): boolean {
		if (!selectedItem) return false;
		const docType = selectedItem.documentType === "folder" ? "folder" : "file";
		deleteDocumentModal.open(selectedItem.id, selectedItem.name, docType);
		return false;
	}
});

function renderHomePageIsLoading(isShow: boolean) {
	const homePage = document.getElementById("home-page")!;
	const tableLoaderElements = homePage.querySelector<HTMLDivElement>(".home-page__table-loading-container")!;
	const listLoaderElement = homePage.querySelector<HTMLDivElement>(".home-page__list-loading-container")!;
	if (isShow) {
		tableLoaderElements.classList.remove("hidden");
		listLoaderElement.classList.remove("hidden");
	} else {
		tableLoaderElements.classList.add("hidden");
		listLoaderElement.classList.add("hidden");
	}
}

function renderHomePageIsEditing(selectedItem: DocumentView | null) {
	const homePageActionElements = document.getElementsByClassName("home-page-actions");
	for (let i = 0; i < homePageActionElements.length; i++) {
		homePageActionElements[i].classList.toggle("hidden", selectedItem == null);
	}
}