import React from 'react';
import { ShopifyTheme, AppConfig } from '../utils/interfaces';

export interface ContextState {
    // set the type of state you want to handle with context e.g.
    config: AppConfig;
    themes: ShopifyTheme[];
    getSearchWorker?: () => Worker;
    updateTheme: (newTheme:ShopifyTheme) => void;
    deleteTheme: (deletedTheme:ShopifyTheme) => void;
    updateThemes: (newThemes:ShopifyTheme[]) => void;
    resetThemes: () => void;
}

export const initAppConfig:AppConfig = {
    enableSearchBar: false,
    tabFilterThemeProperty: {}
};

export const PopupContext = React.createContext<ContextState>({
    config: initAppConfig,
    themes: [],
    updateTheme: () => {},
    deleteTheme: () => {},
    updateThemes: () => {},
    resetThemes: () => {}
});