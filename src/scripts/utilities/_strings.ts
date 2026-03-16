export function stringsIsNullOrBlank(str: string): boolean {
    if (str == null) return true;
    if (str.trim() === '') return true;
    return false;
}
