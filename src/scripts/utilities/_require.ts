/*
Functions to retrive value from (any) object
 */


export function requireString(obj: any, key: string): string {
    const value = obj[key];

    if (value == null) {
        throw new Error(`Missing required field: ${key}`);
    }

    if (typeof value !== "string") {
        throw new Error(`Field ${key} must be a string`);
    }

    return value;
}

export function requireArray(obj: any, key: string): any[] {
    const value = obj[key];

    if (value == null) {
        throw new Error(`Missing required field: ${key}`);
    }

    if (!Array.isArray(value)) {
        throw new Error(`Field ${key} must be an array`);
    }

    return value;
}
