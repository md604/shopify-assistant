// data representation for the popup UI
export interface ShopifyTheme {
    name: string;
    published: boolean;
    developer: boolean;
    id: string;
}

// data representation for the search index
export interface SearchTheme {
    id: string;
    name: string;
}

// data representaion of the raw data fetched via store API
// /admin/themes.js
export interface StorageThemesData {
    domainName: string,
    themes: any
}

export {}