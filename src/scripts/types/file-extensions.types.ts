const FileExtensionsConst = [
    "docx",
    "xlsx"
] as const;

export type FileExtensionsType = typeof FileExtensionsConst[number];
