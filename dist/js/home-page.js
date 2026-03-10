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
/* harmony import */ var _model_enums_file_extensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/enums/file-extensions */ "./src/scripts/model/enums/file-extensions.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/user.service */ "./src/scripts/services/user.service.ts");
/* harmony import */ var _utilities_format_strings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/_format-strings */ "./src/scripts/utilities/_format-strings.ts");



function renderCardList(currentFolder) {
    const userService = new _services_user_service__WEBPACK_IMPORTED_MODULE_1__.UserService();
    const users = userService.getUsers();
    const userByIdMap = users.reduce((acc, user) => {
        acc.set(user.id, user);
        return acc;
    }, new Map());
    const documentModelItems = currentFolder.getItems();
    for (const documentModel of documentModelItems) {
        const userView = userByIdMap.get(documentModel.getModifiedByUserId());
        const documentView = documentModel.getView();
        renderCardItem(documentView, userView);
    }
}
function renderCardItem(documentView, userview) {
    const templateItem = document.getElementById("card-list--template--item");
    const placeholderList = document.getElementById("card-list--placeholder--list");
    const cloned = templateItem.content.cloneNode(true);
    const rowIcon = createCardItemIcon(documentView.extension);
    const rowName = createCardItemName(documentView.name, documentView.isSynced);
    cloned.querySelector("table>thead>tr:nth-child(1)>th:nth-child(2)").appendChild(rowIcon);
    cloned.querySelector("table>tbody>tr:nth-child(1)>td:nth-child(2)").appendChild(rowName);
    cloned.querySelector("table>tbody>tr:nth-child(2)>td:nth-child(2)").appendChild(document.createTextNode((0,_utilities_format_strings__WEBPACK_IMPORTED_MODULE_2__["default"])(documentView.modified)));
    cloned.querySelector("table>tbody>tr:nth-child(3)>td:nth-child(2)").appendChild(document.createTextNode(userview.name));
    placeholderList.appendChild(cloned);
}
function createCardItemIcon(extension) {
    let iconName;
    if (extension == null) {
        iconName = "folder";
    }
    else {
        iconName = _model_enums_file_extensions__WEBPACK_IMPORTED_MODULE_0__.ExtensionToIconName.get(extension) ?? "excel";
    }
    const spanElement = document.createElement("span");
    spanElement.className = `file-card__icon--${iconName}`;
    return spanElement;
}
function createCardItemName(name, hasSyncIcon) {
    const spanElement = document.createElement("span");
    spanElement.textContent = name;
    if (hasSyncIcon) {
        spanElement.className = `file-card__text-file`;
    }
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
/* harmony import */ var _model_enums_file_extensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../model/enums/file-extensions */ "./src/scripts/model/enums/file-extensions.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/user.service */ "./src/scripts/services/user.service.ts");
/* harmony import */ var _utilities_format_strings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utilities/_format-strings */ "./src/scripts/utilities/_format-strings.ts");



function renderTable(currentFolder) {
    const userService = new _services_user_service__WEBPACK_IMPORTED_MODULE_1__.UserService();
    const users = userService.getUsers();
    const userByIdMap = users.reduce((acc, user) => {
        acc.set(user.id, user);
        return acc;
    }, new Map());
    const documentModelItems = currentFolder.getItems();
    for (const documentModel of documentModelItems) {
        const userView = userByIdMap.get(documentModel.getModifiedByUserId());
        const documentView = documentModel.getView();
        renderTableRow(documentView, userView);
    }
}
function renderTableRow(documentView, userview) {
    const templateItem = document.getElementById("documents-table--template--item");
    const placeholderList = document.getElementById("documents-table--placeholder--list");
    const cloned = templateItem.content.cloneNode(true);
    const rowIcon = createTableRowIcon(documentView.extension);
    const rowName = createTableRowName(documentView.name, documentView.isSynced);
    cloned.querySelector("tr>td:nth-child(1)").appendChild(rowIcon);
    cloned.querySelector("tr>td:nth-child(2)").appendChild(rowName);
    cloned.querySelector("tr>td:nth-child(3)").appendChild(document.createTextNode((0,_utilities_format_strings__WEBPACK_IMPORTED_MODULE_2__["default"])(documentView.modified)));
    cloned.querySelector("tr>td:nth-child(4)").appendChild(document.createTextNode(userview.name));
    placeholderList.appendChild(cloned);
}
function createTableRowIcon(extension) {
    let iconName;
    if (extension == null) {
        iconName = "folder";
    }
    else {
        iconName = _model_enums_file_extensions__WEBPACK_IMPORTED_MODULE_0__.ExtensionToIconName.get(extension) ?? "excel";
    }
    const spanElement = document.createElement("span");
    spanElement.className = `file-table__icon--${iconName}`;
    return spanElement;
}
function createTableRowName(name, hasSyncIcon) {
    const spanElement = document.createElement("span");
    spanElement.textContent = name;
    if (hasSyncIcon) {
        spanElement.className = `file-table__text-file`;
    }
    return spanElement;
}


/***/ }),

/***/ "./src/scripts/model/abstracts/document-model.base.ts":
/*!************************************************************!*\
  !*** ./src/scripts/model/abstracts/document-model.base.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DocumentModelBase: function() { return /* binding */ DocumentModelBase; }
/* harmony export */ });
/* harmony import */ var _model_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model.base */ "./src/scripts/model/abstracts/model.base.ts");

class DocumentModelBase extends _model_base__WEBPACK_IMPORTED_MODULE_0__.ModelBase {
    constructor(name, modifiedByUserId, modifiedAt) {
        super();
        this._name = name;
        this._modifiedByUserId = modifiedByUserId;
        this._modified = modifiedAt;
    }
    _getDocumentInfo() {
        return {
            name: this._name,
            modifiedByUserId: this._modifiedByUserId,
            modified: this._modified,
        };
    }
    getModifiedByUserId() {
        return this._modifiedByUserId;
    }
}


/***/ }),

/***/ "./src/scripts/model/abstracts/model.base.ts":
/*!***************************************************!*\
  !*** ./src/scripts/model/abstracts/model.base.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModelBase: function() { return /* binding */ ModelBase; }
/* harmony export */ });
class ModelBase {
}


/***/ }),

/***/ "./src/scripts/model/enums/file-extensions.ts":
/*!****************************************************!*\
  !*** ./src/scripts/model/enums/file-extensions.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtensionToIconName: function() { return /* binding */ ExtensionToIconName; }
/* harmony export */ });
const FileExtensionsConst = [
    "docx",
    "xlsx"
];
const ExtensionToIconName = new Map([
    [undefined, "folder"],
    ["xlsx", "excel"],
    ["docx", "word"]
]);


/***/ }),

/***/ "./src/scripts/model/folder-model.ts":
/*!*******************************************!*\
  !*** ./src/scripts/model/folder-model.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FolderModel: function() { return /* binding */ FolderModel; }
/* harmony export */ });
/* harmony import */ var _abstracts_document_model_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./abstracts/document-model.base */ "./src/scripts/model/abstracts/document-model.base.ts");

class FolderModel extends _abstracts_document_model_base__WEBPACK_IMPORTED_MODULE_0__.DocumentModelBase {
    constructor(name, modifiedByUserId, modified) {
        super(name, modifiedByUserId, modified);
        this._items = [];
    }
    getItems() {
        return this._items;
    }
    addDocument(document) {
        this._items.push(document);
        return this;
    }
    getView() {
        let baseInfo = this._getDocumentInfo();
        return {
            ...baseInfo,
            isSynced: false,
        };
    }
}


/***/ }),

/***/ "./src/scripts/services/user.service.ts":
/*!**********************************************!*\
  !*** ./src/scripts/services/user.service.ts ***!
  \**********************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserService: function() { return /* binding */ UserService; }
/* harmony export */ });
class UserService {
    getUsers() {
        return [
            {
                id: "1",
                name: "Megan Bowen",
                email: "megan@mail.com",
            },
            {
                id: "2",
                name: "Administrator MOD",
                email: "megan@mail.com",
            },
            {
                id: "3",
                name: "Mowen Began",
                email: "megan@mail.com",
            },
        ];
    }
}


/***/ }),

/***/ "./src/scripts/utilities/_events.ts":
/*!******************************************!*\
  !*** ./src/scripts/utilities/_events.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   beforeAppUnload: function() { return /* binding */ beforeAppUnload; },
/* harmony export */   ready: function() { return /* binding */ ready; }
/* harmony export */ });
const ready = (fn) => {
    if (document.readyState !== 'loading') {
        fn();
    }
    else {
        document.addEventListener('DOMContentLoaded', fn);
    }
};
const beforeAppUnload = (fn) => {
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
/* harmony import */ var _model_folder_model__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../model/folder-model */ "./src/scripts/model/folder-model.ts");
Object(function webpackMissingModule() { var e = new Error("Cannot find module '../model/file-model'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var _components_card_list__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/_card-list */ "./src/scripts/components/_card-list.ts");
/* harmony import */ var _utilities_events__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utilities/_events */ "./src/scripts/utilities/_events.ts");






(0,_utilities_events__WEBPACK_IMPORTED_MODULE_5__.ready)(() => {
    const rootFolder = new _model_folder_model__WEBPACK_IMPORTED_MODULE_2__.FolderModel("Documents", "123", new Date("2026-01-01"));
    rootFolder
        .addDocument(new _model_folder_model__WEBPACK_IMPORTED_MODULE_2__.FolderModel("CAS", "1", new Date("2025-04-30")))
        .addDocument(new Object(function webpackMissingModule() { var e = new Error("Cannot find module '../model/file-model'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("CoasterAndBargelLoading", "2", new Date(), "docx", true))
        .addDocument(new Object(function webpackMissingModule() { var e = new Error("Cannot find module '../model/file-model'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("RevenueByServices", "2", new Date(), "xlsx", true))
        .addDocument(new Object(function webpackMissingModule() { var e = new Error("Cannot find module '../model/file-model'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("RevenueByServices2016", "2", new Date(), "xlsx", true))
        .addDocument(new Object(function webpackMissingModule() { var e = new Error("Cannot find module '../model/file-model'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("RevenueByServices2017", "2", new Date(), "xlsx", true));
    (0,_components_navbar__WEBPACK_IMPORTED_MODULE_1__["default"])();
    (0,_components_table__WEBPACK_IMPORTED_MODULE_0__["default"])(rootFolder);
    (0,_components_card_list__WEBPACK_IMPORTED_MODULE_4__["default"])(rootFolder);
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