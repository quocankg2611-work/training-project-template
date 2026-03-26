import { HtmlUtils } from "../utilities/_html";

export class NavbarComponent {
    private readonly NEW_FOLDER_BUTTON_ID = "homePageNavbarNewFolder";
    private readonly UPLOAD_FILE_BUTTON_ID = "homePageNavbarUploadFile";
    private readonly UPLOAD_FOLDER_BUTTON_ID = "homePageNavbarUploadFolder";
    private readonly LOGOUT_BUTTON_ID = "homePageNavbarLogoutButton";

    constructor(
        private readonly onNavbarNewFolderClick: () => void,
        private readonly onNavbarUploadFolderClick: () => void,
        private readonly onNavbarUploadFileClick: () => void,
        private readonly onNavbarLogoutClick: () => void,
    ) {}

    public build(isLoggedIn: boolean): HTMLElement {
        const element = HtmlUtils.stringToSingleHtmlElement(this.buildHtmlString(isLoggedIn));

        element.querySelector<HTMLAnchorElement>(`#${this.NEW_FOLDER_BUTTON_ID}`)?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarNewFolderClick();
        });

        element.querySelector<HTMLAnchorElement>(`#${this.UPLOAD_FILE_BUTTON_ID}`)?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarUploadFileClick();
        });

        element.querySelector<HTMLAnchorElement>(`#${this.UPLOAD_FOLDER_BUTTON_ID}`)?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarUploadFolderClick();
        });

        element.querySelector<HTMLButtonElement>(`#${this.LOGOUT_BUTTON_ID}`)?.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.onNavbarLogoutClick();
        });

        return element;
    }

    public buildHtmlString(isLoggedIn: boolean): string {
        return `
            <nav class="navbar navbar-expand-lg py-0">
                <div class="container-fluid px-0 w-100">

                    <div class="d-lg-none d-flex border-bottom border-1 border-terretri container-fluid px-3 py-2">
                        <button class="navbar-toggler ms-auto"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div class="collapse navbar-collapse"
                        id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-lg-0">
                            <li class="nav-item dropdown">
                                <button class="nav-button dropdown-button"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                    <span class="nav-button__icon--add"></span>
                                    <span>New</span>
                                    <span class="nav-button__dropdown-indicator "></span>
                                </button>
                                <div class="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton">
                                    <a id="homePageNavbarNewFolder"
                                    class="dropdown-item"
                                    href="#">Folder</a>
                                </div>
                            </li>
                            <li class="nav-item dropdown">
                                <button class="nav-button"
                                        type="button"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false">
                                    <span class="nav-button__icon--upload"></span>
                                    <span>Upload</span>
                                    <span class="nav-button__dropdown-indicator "></span>
                                </button>
                                <div class="dropdown-menu"
                                    aria-labelledby="dropdownMenuButton">
                                    <a id="homePageNavbarUploadFile"
                                    class="dropdown-item"
                                    href="#">Files</a>
                                    <a class="dropdown-item"
                                    href="#"
                                    id="homePageNavbarUploadFolder">Folders</a>
                                </div>
                            </li>
                            <li class="nav-item">
                                <button class="nav-button">
                                    <span class="nav-button__icon--sync"></span>
                                    <span>Sync</span>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-button">
                                    <span class="nav-button__icon--export-to-excel"></span>
                                    <span>Export to Excel</span>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-button">
                                    <span class="nav-button__icon--flow"></span>
                                    <span>Flow</span>
                                    <span class="nav-button__dropdown-indicator "></span>
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-button">
                                    <span class="nav-button__more-option">...</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    ${isLoggedIn === false ? `
                        <div class="d-flex">
                            <button class="nav-button nav-button--primary">
                                <span>Sign up</span>
                            </button>
                        </div>
                    ` : `
                        <div class="d-flex">
                            <button class="nav-button nav-button--text" id="${this.LOGOUT_BUTTON_ID}">
                                <span>Logout</span>
                            </button>
                        </div>
                    `}
                </div>
            </nav>
        `;
    }
}
