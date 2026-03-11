import renderTable from '../components/_table';
import renderCardList from '../components/_card-list';
import { onAppBeforeUnload, onAppReady } from '../utilities/_events';
import DocumentService from '../services/_document.service';
import renderBreadcrumb from '../components/_breadcrumb';
import setupAddFolderModal from '../components/_add-folder-modal';
import setupUploadFileModal from '../components/_upload-file-modal';
import setupUpdateFolderModal from '../components/_update-folder-modal';
import { FileExtensionsType } from '../types/_file-extensions.types';
import { DocumentView } from '../components/view-model/_document.view';
import setupUpdateFileModal from '../components/_update-file-modal';
import setupDeleteDocumentModal from '../components/_delete-document-modal';
import { FolderModel } from '../model/_folder.model';

onAppReady(() => bootstrap());

async function bootstrap() {
	const documentService = new DocumentService();

	renderHomePageIsLoading(true);
	await documentService.loadRootFolder();
	renderHomePageIsLoading(false);

	let selectedItem: DocumentView | null = null;
	let currentFolder: FolderModel = await documentService.getCurrentFolder();

	render();

	document.getElementById("editBtnHomePage")!.addEventListener("click", () => {
		onEditSelectedItem();
	});

	document.getElementById("deleteBtnHomePage")!.addEventListener("click", () => {
		onDeleteSelectedItem();
	});

	document.getElementById("cancelBtnHomePage")!.addEventListener("click", () => {
		selectedItem = null;
		renderHomePageIsEditing(selectedItem);
		renderBodyWhenSelected(currentFolder, selectedItem);
	});

	setupAddFolderModal(async (folderName: string) => {
		renderHomePageIsLoading(true);
		await documentService.addFolder(folderName);
		renderHomePageIsLoading(false);
		render();
	});

	const updateFolderModal = setupUpdateFolderModal(async (folderId: string, folderName: string) => {
		renderHomePageIsLoading(true);
		await documentService.updateFolder(folderId, folderName);
		selectedItem = null;
		renderHomePageIsLoading(false);
		render();
	});

	const updateFileModal = setupUpdateFileModal(async (fileId: string, fileName: string) => {
		renderHomePageIsLoading(true);
		await documentService.updateFile(fileId, fileName);
		selectedItem = null;
		renderHomePageIsLoading(false);
		render();
	});

	const deleteDocumentModal = setupDeleteDocumentModal(async (documentId: string, documentType: "folder" | "file") => {
		renderHomePageIsLoading(true);
		if (documentType === "folder") {
			await documentService.deleteFolder(documentId);
		} else {
			await documentService.deleteFile(documentId);
		}
		selectedItem = null;
		renderHomePageIsLoading(false);
		render();
	});

	setupUploadFileModal(async (fileName: string, extension: string, content: string) => {
		renderHomePageIsLoading(true);
		await documentService.addFile(fileName, extension as FileExtensionsType, content);
		renderHomePageIsLoading(false);
		render();
	});

	onAppBeforeUnload(() => {
		documentService.saveRootFolder();
	});

	async function onFolderSeletectedFromBody(selectedFolder: FolderModel): Promise<void> {
		await documentService.navigateToFolder(selectedFolder.id);
		selectedItem = null;
		currentFolder = selectedFolder;
		renderHomePageIsEditing(null);
		render();
	}

	// ===============================
	// View
	// ===============================

	async function renderBodyWhenSelected(currentFolder: FolderModel, selectedItem: DocumentView | null): Promise<void> {
		renderTable(
			currentFolder,
			onFolderSeletectedFromBody,
			selectedItem,
			(item) => { selectedItem = item; renderBodyWhenSelected(currentFolder, item); }
		);
		renderCardList(
			currentFolder,
			onFolderSeletectedFromBody,
			selectedItem,
			(item) => { selectedItem = item; renderBodyWhenSelected(currentFolder, item); }
		);
		renderHomePageIsEditing(selectedItem);
	}

	async function render() {
		renderHomePageIsLoading(true);
		const folderStack = await documentService.getFolderStack();
		const currentFolder = await documentService.getCurrentFolder();
		renderHomePageIsLoading(false);

		renderBreadcrumb(folderStack, async (selectedFolder) => {
			await documentService.navigateBackToFolder(selectedFolder.id);
			selectedItem = null;
			renderHomePageIsEditing(null);
			render();
		});
		renderTable(
			currentFolder,
			onFolderSeletectedFromBody,
			selectedItem,
			(item) => { selectedItem = item; renderBodyWhenSelected(currentFolder, item); }
		);
		renderCardList(
			currentFolder,
			onFolderSeletectedFromBody,
			selectedItem,
			(item) => { selectedItem = item; renderBodyWhenSelected(currentFolder, item); }
		);
	}

	// ===============================
	// Actions
	// ===============================

	function onEditSelectedItem(): void {
		if (!selectedItem) return;
		if (selectedItem.documentType === "folder") {
			updateFolderModal.open(selectedItem.id, selectedItem.name);
		} else {
			updateFileModal.open(selectedItem.id, selectedItem.name);
		}
	}

	function onDeleteSelectedItem(): void {
		if (!selectedItem) return;
		const docType = selectedItem.documentType === "folder" ? "folder" : "file";
		deleteDocumentModal.open(selectedItem.id, selectedItem.name, docType);
	}
}


function renderHomePageIsLoading(isShow: boolean) {
	const homePage = document.getElementById("homePage")!;
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
