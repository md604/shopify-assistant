// global app config
export interface AppConfig {
    enableSearchBar: boolean;
    tabFilterThemeProperty: Partial<ShopifyTheme>;
}

/*
export type Partial<T> = {
    [Property in keyof T]: T[Property]
}
*/
export interface ThemeMeta {
    pinned: boolean;
    available: boolean;
    tags: string[];
}
export const defaultThemeMeta: ThemeMeta = {
    pinned: false,
    available: false,
    tags: []
};

// data representation for the popup UI
export interface ShopifyTheme extends ThemeMeta {
    name: string;
    domainName: string;
    lastUpdate: number;
    published: boolean;
    developer: boolean;
    id: number;
}
export const defaultShopifyTheme: ShopifyTheme = {
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