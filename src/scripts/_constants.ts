export const CONSTANTS = {
    API_BASE_URL: "https://localhost:7115",
} as const;

export const EXTENSION_TO_ICON_MAP: Record<string, string> = {
    ".doc": "word",
    ".docx": "word",
    ".xls": "excel",
    ".xlsx": "excel",
    ".ppt": "powerpoint",
    ".pptx": "powerpoint",
    ".pdf": "pdf",
    ".txt": "text",
    ".jpg": "image",
} as const;