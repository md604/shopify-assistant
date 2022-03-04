// global app config
export interface AppConfig {
    enableSearchBar: boolean;
}

/*
export type Partial<T> = {
    [Property in keyof T]: T[Property]
}
*/
export interface ThemeMeta {
    available: boolean;
    tags: string[];
}
export const defaultThemeMeta = {
    available: false,
    tags: []
};

// data representation for the popup UI
export interface ShopifyTheme {
    name: string;
    domainName: string;
    lastUpdate: number;
    published: boolean;
    developer: boolean;
    pinned: boolean;
    id: number;
    available: ThemeMeta['available'];
    tags: ThemeMeta['tags'];
}
export const defaultShopifyTheme = {
    name: 'Default theme name',
    domainName: '',
    lastUpdate: 0,
    published: false,
    developer: false,
    pinned: false,
    id: 0,
    available: false,
    tags:[]
};

// data representaion of the raw data fetched via store API
// /admin/themes.js
export interface StorageThemesData {
    domainName: string,
    themes: any
}

export {}