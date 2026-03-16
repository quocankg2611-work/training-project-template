export class HtmlUtils {
    /**
     * Intended for HTML strings that contain a single root element. Will return the first element if multiple are present, but this is not recommended.
     * @param htmlString - The HTML string to convert to an element.
     * @returns The first HTMLElement represented by the HTML string.
     */
    public static stringToSingleHtmlElement(htmlString: string): HTMLElement {
        const template = document.createElement("template");
        template.innerHTML = htmlString.trim();
        return template.content.firstElementChild as HTMLElement;
    }

    public static replaceElementWithHtml(placeholderId: string, element: HTMLElement): void {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            throw new Error(`Placeholder element with ID '${placeholderId}' not found.`);
        }
        placeholder.replaceWith(element);
    }
}