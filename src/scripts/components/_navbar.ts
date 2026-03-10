export default function renderNavbar() {
    const navbarTemplate = document.getElementById("navbar--template") as HTMLTemplateElement;
    const clonedNavbarTemplate = navbarTemplate.content.cloneNode(true);
    const navbarPlaceholder = document.getElementById("navbar--placeholder");
    navbarPlaceholder.appendChild(clonedNavbarTemplate);
}