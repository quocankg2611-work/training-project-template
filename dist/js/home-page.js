/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/components/_card-list.ts":
/*!**********************************************!*\
  !*** ./src/scripts/components/_card-list.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ renderCardList; }
/* harmony export */ });
/* harmony import */ var _views_document_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./views/_document.view */ "./src/scripts/components/views/_document.view.ts");

function renderCardList(currentFolder) {
    const documentItemViews = [];
    currentFolder.files.forEach(file => {
        documentItemViews.push((0,_views_document_view__WEBPACK_IMPORTED_MODULE_0__.documentViewFromFileModel)(file));
    });
    currentFolder.subFolders.forEach(folder => {
        documentItemViews.push((0,_views_document_view__WEBPACK_IMPORTED_MODULE_0__.documentViewFromFolderModel)(folder));
    });
    documentItemViews.sort((a, b) => {
        return a.modified.getTime() - b.modified.getTime();
    });
    for (const documentItemView of documentItemViews) {
        renderCardItem(documentItemView);
    }
}
function renderCardItem(documentView) {
    const templateItem = document.getElementById("card-list--template--item");
    const placeholderList = document.getElementById("card-list--placeholder--list");
    const cloned = templateItem.content.cloneNode(true);
    const rowIcon = createCardItemIcon(documentView.iconName);
    const rowName = createCardItemName(documentView.name);
    cloned.querySelector("table>thead>tr:nth-child(1)>th:nth-child(2)").appendChild(rowIcon);
    cloned.querySelector("table>tbody>tr:nth-child(1)>td:nth-child(2)").appendChild(rowName);
    cloned.querySelector("table>tbody>tr:nth-child(2)>td:nth-child(2)").appendChild(document.createTextNode(documentView.modifiedStr));
    cloned.querySelector("table>tbody>tr:nth-child(3)>td:nth-child(2)").appendChild(document.createTextNode(documentView.modifiedBy));
    placeholderList.appendChild(cloned);
}
function createCardItemIcon(iconName) {
    const spanElement = document.createElement("span");
    spanElement.className = `file-card__icon--${iconName}`;
    return spanElement;
}
function createCardItemName(name) {
    const spanElement = document.createElement("span");
    spanElement.textContent = name;
    spanElement.className = `file-card__text-file`;
    return spanElement;
}


/***/ }),

/***/ "./src/scripts/components/_navbar.ts":
/*!*******************************************!*\
  !*** ./src/scripts/components/_navbar.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ renderNavbar; }
/* harmony export */ });
function renderNavbar() {
    const navbarTemplate = document.getElementById("navbar--template");
    const clonedNavbarTemplate = navbarTemplate.content.cloneNode(true);
    const navbarPlaceholder = document.getElementById("navbar--placeholder");
    navbarPlaceholder.appendChild(clonedNavbarTemplate);
}


/***/ }),

/***/ "./src/scripts/components/_table.ts":
/*!******************************************!*\
  !*** ./src/scripts/components/_table.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ renderTable; }
/* harmony export */ });
/* harmony import */ var _views_document_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./views/_document.view */ "./src/scripts/components/views/_document.view.ts");

function renderTable(currentFolder) {
    const documentItemViews = [];
    currentFolder.files.forEach(file => {
        documentItemViews.push((0,_views_document_view__WEBPACK_IMPORTED_MODULE_0__.documentViewFromFileModel)(file));
    });
    currentFolder.subFolders.forEach(folder => {
        documentItemViews.push((0,_views_document_view__WEBPACK_IMPORTED_MODULE_0__.documentViewFromFolderModel)(folder));
    });
    documentItemViews.sort((a, b) => {
        return a.modified.getTime() - b.modified.getTime();
    });
    for (const documentItemView of documentItemViews) {
        renderTableRow(documentItemView);
    }
}
function renderTableRow(documentView) {
    const templateItem = document.getElementById("documents-table--template--item");
    const placeholderList = document.getElementById("documents-table--placeholder--list");
    const cloned = templateItem.content.cloneNode(true);
    const rowIcon = createTableRowIcon(documentView.iconName);
    const rowName = createTableRowName(documentView.name);
    cloned.querySelector("tr>td:nth-child(1)").appendChild(rowIcon);
    cloned.querySelector("tr>td:nth-child(2)").appendChild(rowName);
    cloned.querySelector("tr>td:nth-child(3)").appendChild(document.createTextNode(documentView.modifiedStr));
    cloned.querySelector("tr>td:nth-child(4)").appendChild(document.createTextNode(documentView.modifiedBy));
    placeholderList.appendChild(cloned);
}
function createTableRowIcon(iconName) {
    const spanElement = document.createElement("span");
    spanElement.className = `file-table__icon--${iconName}`;
    return spanElement;
}
function createTableRowName(name) {
    const spanElement = document.createElement("span");
    spanElement.textContent = name;
    spanElement.className = `file-table__text-file`;
    return spanElement;
}


/***/ }),

/***/ "./src/scripts/components/views/_document.view.ts":
/*!********************************************************!*\
  !*** ./src/scripts/components/views/_document.view.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   documentViewFromFileModel: function() { return /* binding */ documentViewFromFileModel; },
/* harmony export */   documentViewFromFolderModel: function() { return /* binding */ documentViewFromFolderModel; }
/* harmony export */ });
/* harmony import */ var _utilities_format_strings__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utilities/_format-strings */ "./src/scripts/utilities/_format-strings.ts");

const FileExtensionToIconName = new Map([
    ["xlsx", "excel"],
    ["docx", "word"]
]);
function documentViewFromFileModel(file) {
    const iconName = FileExtensionToIconName.get(file.extension);
    return {
        ...file,
        modifiedStr: (0,_utilities_format_strings__WEBPACK_IMPORTED_MODULE_0__["default"])(file.modified),
        iconName,
    };
}
function documentViewFromFolderModel(folder) {
    return {
        ...folder,
        modifiedStr: (0,_utilities_format_strings__WEBPACK_IMPORTED_MODULE_0__["default"])(folder.modified),
        iconName: "folder",
    };
}


/***/ }),

/***/ "./src/scripts/services/_document.service.ts":
/*!***************************************************!*\
  !*** ./src/scripts/services/_document.service.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ DocumentService; }
/* harmony export */ });
/* harmony import */ var _utilities_require__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utilities/_require */ "./src/scripts/utilities/_require.ts");
/* harmony import */ var _utilities_strings__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utilities/_strings */ "./src/scripts/utilities/_strings.ts");


class DocumentService {
    constructor() {
        this._KEY = "document-service";
    }
    seedDataIfNotExists() {
        return new Promise((resolve, reject) => {
            try {
                const existingJsonStr = localStorage.getItem(this._KEY);
                if ((0,_utilities_strings__WEBPACK_IMPORTED_MODULE_1__.stringsIsNullOrBlank)(existingJsonStr)) {
                    const seedJsonStr = JSON.stringify(seedFolder);
                    localStorage.setItem(this._KEY, seedJsonStr);
                }
                else {
                    console.log("Did not seed data. There is an existing record.");
                }
                resolve();
            }
            catch (err) {
                console.error(err);
                reject("There's an error while seeding data");
            }
        });
    }
    getRootFolder() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const jsonStr = localStorage.getItem(this._KEY);
                    if ((0,_utilities_strings__WEBPACK_IMPORTED_MODULE_1__.stringsIsNullOrBlank)(jsonStr) === true) {
                        reject("Not found.");
                    }
                    else {
                        const json = JSON.parse(jsonStr);
                        const folder = folderParser(json);
                        resolve(folder);
                    }
                }
                catch (error) {
                    reject(error);
                }
            }, 2000);
        });
    }
    saveRootFolder(folder) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    const jsonStr = JSON.stringify(folder);
                    localStorage.setItem(this._KEY, jsonStr);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
            }, 2000);
        });
    }
}
/**
 * Initial data
 */
const seedFolder = {
    id: crypto.randomUUID(),
    name: "Documents",
    modified: new Date("2026-01-01"),
    modifiedBy: "Megan Bowen",
    files: [
        {
            id: crypto.randomUUID(),
            name: "CoasterAndBargelLoading",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "docx"
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx"
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices2016",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx"
        },
        {
            id: crypto.randomUUID(),
            name: "RevenueByServices2017",
            modified: new Date(),
            modifiedBy: "Administrator MOD",
            extension: "xlsx"
        }
    ],
    subFolders: [
        {
            id: crypto.randomUUID(),
            name: "CAS",
            modified: new Date("2025-04-30"),
            modifiedBy: "Megan Bowen",
            files: [],
            subFolders: []
        }
    ]
};
/**
 * Parsers
 */
function folderParser(obj) {
    const id = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "id");
    const name = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "name");
    const modified = new Date((0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "modified"));
    const modifiedBy = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "modifiedBy");
    const files = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireArray)(obj, "files").map(fileParser);
    const subFolders = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireArray)(obj, "subFolders").map(folderParser);
    return {
        id,
        name,
        modified,
        modifiedBy,
        files,
        subFolders,
    };
}
function fileParser(obj) {
    const id = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "id");
    const name = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "name");
    const modified = new Date((0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "modified"));
    const modifiedBy = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "modifiedBy");
    const extension = (0,_utilities_require__WEBPACK_IMPORTED_MODULE_0__.requireString)(obj, "extension") ?? "docx";
    return {
        id,
        name,
        modified,
        modifiedBy,
        extension,
    };
}


/***/ }),

/***/ "./src/scripts/utilities/_events.ts":
/*!******************************************!*\
  !*** ./src/scripts/utilities/_events.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   onAppBeforeUnload: function() { return /* binding */ onAppBeforeUnload; },
/* harmony export */   onAppReady: function() { return /* binding */ onAppReady; }
/* harmony export */ });
const onAppReady = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
const onAppBeforeUnload = (fn) => {
    window.addEventListener("beforeunload", fn);
};


/***/ }),

/***/ "./src/scripts/utilities/_format-strings.ts":
/*!**************************************************!*\
  !*** ./src/scripts/utilities/_format-strings.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ formatTimeAgo; }
/* harmony export */ });
/**
 * Rules:
 * - < 60 seconds: A few seconds ago
 * - < 60 minutes: X minutes ago
 * - < 24 hours: X hours ago
 * - < 7 days: X days ago
 * - Same year: Month DD
 * - Different year: yyyy Month DD
 */
function formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (60 * 1000));
    const hours = Math.floor(diffMs / (60 * 60 * 1000));
    const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
    if (seconds < 60) {
        return "A few seconds ago";
    }
    if (minutes < 60) {
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
    }
    if (hours < 24) {
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    }
    if (days < 7) {
        return `${days} day${days === 1 ? "" : "s"} ago`;
    }
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    if (diffMs < oneYearMs) {
        return `${month} ${day}`;
    }
    const year = date.getFullYear();
    return `${year} ${month} ${day}`;
}


/***/ }),

/***/ "./src/scripts/utilities/_require.ts":
/*!*******************************************!*\
  !*** ./src/scripts/utilities/_require.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   requireArray: function() { return /* binding */ requireArray; },
/* harmony export */   requireString: function() { return /* binding */ requireString; }
/* harmony export */ });
/*
Functions to retrive value from (any) object
 */
function requireString(obj, key) {
    const value = obj[key];
    if (value == null) {
        throw new Error(`Missing required field: ${key}`);
    }
    if (typeof value !== "string") {
        throw new Error(`Field ${key} must be a string`);
    }
    return value;
}
function requireArray(obj, key) {
    const value = obj[key];
    if (value == null) {
        throw new Error(`Missing required field: ${key}`);
    }
    if (!Array.isArray(value)) {
        throw new Error(`Field ${key} must be an array`);
    }
    return value;
}


/***/ }),

/***/ "./src/scripts/utilities/_strings.ts":
/*!*******************************************!*\
  !*** ./src/scripts/utilities/_strings.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   stringsIsNullOrBlank: function() { return /* binding */ stringsIsNullOrBlank; }
/* harmony export */ });
function stringsIsNullOrBlank(str) {
    if (str == null)
        return true;
    if (str.trim() === '')
        return true;
    return false;
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
var __webpack_exports__ = {};
/*!****************************************!*\
  !*** ./src/scripts/pages/home-page.ts ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_table__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/_table */ "./src/scripts/components/_table.ts");
/* harmony import */ var _components_navbar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../components/_navbar */ "./src/scripts/components/_navbar.ts");
/* harmony import */ var _components_card_list__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/_card-list */ "./src/scripts/components/_card-list.ts");
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utilities/_events */ "./src/scripts/utilities/_events.ts");
/* harmony import */ var _services_document_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/_document.service */ "./src/scripts/services/_document.service.ts");





(0,_utilities_events__WEBPACK_IMPORTED_MODULE_3__.onAppReady)(() => {
    const documentService = new _services_document_service__WEBPACK_IMPORTED_MODULE_4__["default"]();
    documentService.seedDataIfNotExists();
    (0,_components_navbar__WEBPACK_IMPORTED_MODULE_1__["default"])();
    documentService.getRootFolder()
        .then(rootFolder => {
        (0,_components_table__WEBPACK_IMPORTED_MODULE_0__["default"])(rootFolder);
        (0,_components_card_list__WEBPACK_IMPORTED_MODULE_2__["default"])(rootFolder);
    })
        .catch(err => {
        console.log(err);
    });
});

}();
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other entry modules.
!function() {
/*!*****************************************!*\
  !*** ./src/styles/pages/home-page.scss ***!
  \*****************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

}();
/******/ })()
;
//# sourceMappingURL=home-page.js.map