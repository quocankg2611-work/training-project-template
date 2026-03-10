import renderTable from '../components/_table';
import renderCardList from '../components/_card-list';
import { onAppBeforeUnload, onAppReady } from '../utilities/_events';
import DocumentService from '../services/_document.service';
import { FolderModel } from '../model/_folder.model';
import renderBreadcrumb from '../components/_breadcrumb';
import setupAddFolderModal from '../components/_add-folder-modal';

onAppReady(async () => {
	const documentService = new DocumentService();
	const pathsStack = ["Home"];

	documentService.seedDataIfNotExists();

	renderBreadcrumb(pathsStack, (crumb) => {
		console.log(`Breadcrumb clicked: ${crumb}`);
	});
	renderHomePageIsLoading(true);
	const rootFolder = await documentService.getRootFolder();
	renderHomePageIsLoading(false);
	renderHomePageData(rootFolder);

	setupAddFolderModal((folderName: string) => {
		const newFolder: FolderModel = {
			id: crypto.randomUUID(),
			modified: new Date(),
			name: folderName,
			modifiedBy: "Current User",
			subFolders: [],
			files: [],
		};
		rootFolder.subFolders.push(newFolder);
		renderHomePageData(rootFolder);
	});

	onAppBeforeUnload(() => {
		documentService.saveRootFolder(rootFolder);
	});
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

function renderHomePageData(rootFolder: FolderModel) {
	renderTable(rootFolder);
	renderCardList(rootFolder);
}