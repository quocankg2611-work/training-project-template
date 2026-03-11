export function stringsIsNullOrBlank(str: string): boolean {
    if (str == null) return true;
    if (str.trim() === '') return true;
    return false;
}

export function stringToHtmlElement(htmlString: string): HTMLElement {
    const template = document.createElement("template");
    template.innerHTML = htmlString.trim();
    return template.content.firstElementChild as HTMLElement;
}
