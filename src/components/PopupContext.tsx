import React from 'react';

export interface ShopifyTheme {
    name: string;
    published: boolean;
    developer: boolean;
    id: string;
}

export interface ContextState {
    // set the type of state you want to handle with context e.g.
    themes: ShopifyTheme[];
    updateThemes: (newThemes:ShopifyTheme[]) => void;
}

export const PopupContext = React.createContext<ContextState>({
    themes: [],
    updateThemes: () => {}
});