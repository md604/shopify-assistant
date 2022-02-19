// global app config
export interface AppConfig {
    enableSearchBar: boolean;
}

/*
export type Partial<T> = {
    [Property in keyof T]: T[Property]
}
*/

// data representation for the popup UI
export interface ShopifyTheme {
    name: string;
    published: boolean;
    developer: boolean;
    id: number;
}

// data representaion of the raw data fetched via store API
// /admin/themes.js
export interface StorageThemesData {
    domainName: string,
    themes: any
}

export {}