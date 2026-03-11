import renderTable from '../components/_table';
import renderCardList from '../components/_card-list';
import { onAppBeforeUnload, onAppReady } from '../utilities/_events';
import DocumentService from '../services/_document.service';
import renderBreadcrumb from '../components/_breadcrumb';
import setupAddFolderModal from '../components/_add-folder-modal';
import setupUploadFileModal from '../components/_upload-file-modal';
import setupUpdateFolderModal from '../components/_update-folder-modal';
import { FileExtensionsType } from '../types/_file-extensions.types';
import { DocumentView } from '../components/views/_document.view';
import setupUpdateFileModal from '../components/_update-file-modal';
import setupDeleteDocumentModal from '../components/_delete-document-modal';
import { FolderModel } from '../model/_folder.model';

onAppReady(async () => {

	const documentService = new DocumentService();

	renderHomePageIsLoading(true);
	await documentService.loadRootFolder();
	renderHomePageIsLoading(false);

	let selectedItem: DocumentView | null = null;

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
		render();
	});

	setupAddFolderModal(async (folderName: string) => {
		renderHomePageIsLoading(true);
		await documentService.addFolder(folderName);
		renderHomePageIsLoading(false);
		render();
	});

	const updateFolderModal = setupUpdateFolderModal(async (folderId: string, folderName: string) => {
		await documentService.updateFolder(folderId, folderName);
		selectedItem = null;
		render();
	});

	const updateFileModal = setupUpdateFileModal(async (fileId: string, fileName: string) => {
		await documentService.updateFile(fileId, fileName);
		selectedItem = null;
		render();
	});

	const deleteDocumentModal = setupDeleteDocumentModal(async (documentId: string, documentType: "folder" | "file") => {
		if (documentType === "folder") {
			await documentService.deleteFolder(documentId);
		} else {
			await documentService.deleteFile(documentId);
		}
		selectedItem = null;
		render();
	});

	setupUploadFileModal(async (fileName: string, extension: string, content: string) => {
		await documentService.addFile(fileName, extension as FileExtensionsType, content);
		render();
	});

	onAppBeforeUnload(() => {
		documentService.saveRootFolder();
	});

	// ===============================
	// View
	// ===============================

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
			async (selectedFolder) => {
				await documentService.navigateToFolder(selectedFolder.id);
				selectedItem = null;
				renderHomePageIsEditing(null);
				render();
			},
			selectedItem,
			(item) => { selectedItem = item; render(); }
		);
		renderCardList(
			currentFolder,
			async (selectedFolder) => {
				await documentService.navigateToFolder(selectedFolder.id);
				selectedItem = null;
				renderHomePageIsEditing(null);
				render();
			},
			selectedItem,
			(item) => { selectedItem = item; render(); }
		);
		renderHomePageIsEditing(null);
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
});

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

// function homePageViewModel(documentService: DocumentService) {
// 	// States

// 	let isLoading = true;
// 	let isFetching = false;
// 	let seletedItem: DocumentView | null = null;

// 	// Handlers

// 	async function onBreadcrumbFolderSelected(selectedFolder: FolderModel): Promise<void> {
// 		await documentService.navigateBackToFolder(selectedFolder.id);
// 		selectedItem = null;
// 		renderHomePageIsEditing(selectedItem);
// 		render();
// 	}

// 	// View models

// 	const breadcrumbViewModel = homePageBreadcrumbViewModel(onBreadcrumbFolderSelected);


// 	return {
// 		render(): void {
// 			homePageBreadcrumbViewModel(folderStack, onBreadcrumbFolderSelected);
// 		}
// 	}
// }

// function homePageBreadcrumbViewModel(onFolderSelected: (selectedFolder: FolderModel) => void) {
// 	let folderStack: FolderModel[] = [];
// 	return {
// 		render(): void {
// 			renderBreadcrumb(folderStack, onFolderSelected);
// 		}
// 	}

// }