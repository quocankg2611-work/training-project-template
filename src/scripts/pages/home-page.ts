import renderTable from '../components/_table';
import renderCardList from '../components/_card-list';
import { onAppBeforeUnload, onAppReady } from '../utilities/_events';
import DocumentService from '../services/_document.service';
import { FolderModel } from '../model/_folder.model';
import renderBreadcrumb from '../components/_breadcrumb';
import setupAddFolderModal from '../components/_add-folder-modal';
import setupUploadFileModal from '../components/_upload-file-modal';
import { FileModel } from '../model/_file.model';
import { FileExtensionsType } from '../types/_file-extensions.types';

onAppReady(async () => {

	const documentService = new DocumentService();
	documentService.seedDataIfNotExists();

	renderHomePageIsLoading(true);

	const rootFolder = await documentService.getRootFolder();
	const folderStack: FolderModel[] = [rootFolder];

	// Compute
	const folderRef = () => folderStack[folderStack.length - 1];

	renderHomePageIsLoading(false);

	render();

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
		renderTable(folderRef(), (selectedFolder) => navigateIntoFolderStack(folderStack, selectedFolder.id) && render());
		renderCardList(folderRef(), (selectedFolder) => navigateIntoFolderStack(folderStack, selectedFolder.id) && render());
	}

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
});

function renderHomePageIsLoading(isShow: boolean) {
	const homePage = document.getElementById("home-page");
	const tableLoaderElements = homePage.querySelector<HTMLDivElement>(".home-page__table-loading-container");
	const listLoaderElement = homePage.querySelector<HTMLDivElement>(".home-page__list-loading-container");
	if (isShow) {
		tableLoaderElements.classList.remove("hidden");
		listLoaderElement.classList.remove("hidden");
	} else {
		tableLoaderElements.classList.add("hidden");
		listLoaderElement.classList.add("hidden");
	}
}

