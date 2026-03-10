import renderTable from '../components/_table';
import renderNavbar from '../components/_navbar';
import renderCardList from '../components/_card-list';
import { onAppReady } from '../utilities/_events';
import DocumentService from '../services/_document.service';

onAppReady(() => {
	const documentService = new DocumentService();

	documentService.seedDataIfNotExists();

	renderNavbar();
	documentService.getRootFolder()
		.then(rootFolder => {
			renderTable(rootFolder);
			renderCardList(rootFolder);
		})
		.catch(err => {
			console.log(err);
		});
});

