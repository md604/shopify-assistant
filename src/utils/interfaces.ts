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
    githubRepositoryId: number;
    githubRepositoryName: string;
    githubBranchName: string;
}
export const defaultThemeMeta: ThemeMeta = {
    pinned: false,
    available: true,
    tags: [],
    githubRepositoryId: 0,
    githubRepositoryName: '',
    githubBranchName: ''
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
    available: true,
    tags:[],
    githubRepositoryId: 0,
    githubRepositoryName: '',
    githubBranchName: ''
};

// augmented data representaion of the raw data (themes: any) fetched via store API
// /admin/themes.js
export interface StorageThemesData {
    domainName: string,
    themes: any
}

export default {}