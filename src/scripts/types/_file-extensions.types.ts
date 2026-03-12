const FileExtensionsConst = [
    "docx",
    "xlsx"
] as const;

export type FileExtensionsType = typeof FileExtensionsConst[number];

export const FileExtensionValidation = (extension: string): extension is FileExtensionsType => {
    return (FileExtensionsConst as ReadonlyArray<string>).includes(extension);
}   
