import React from 'react';
import { ShopifyTheme, AppConfig } from '../utils/interfaces';

export interface ContextState {
    // set the type of state you want to handle with context e.g.
    config: AppConfig;
    themes: ShopifyTheme[];
    updateThemes: (newThemes:ShopifyTheme[]) => void;
}

export const initAppConfig:AppConfig = {
    enableSearchBar: false
};

export const PopupContext = React.createContext<ContextState>({
    config: initAppConfig,
    themes: [],
    updateThemes: () => {}
});