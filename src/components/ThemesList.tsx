import React, { useState, useContext, useEffect, useMemo } from 'react';
import { AppConfig, ShopifyTheme } from '../utils/interfaces';
//import { Card } from '@shopify/polaris';
import { PopupContext } from './PopupContext';
//import { ShopifyTheme } from '../utils/interfaces';
import { ThemesCard } from './ThemesCard';

function getFilteredThemes(themes:ShopifyTheme[],config:AppConfig):ShopifyTheme[] {
    const tabFilterProps = Object.keys(config.tabFilterThemeProperty);
    let result:ShopifyTheme[] = themes;
    
    if (tabFilterProps.length > 0){
        const filterKey = tabFilterProps[0],
            filterValue = config.tabFilterThemeProperty[filterKey as keyof ShopifyTheme];
        result = themes.filter(theme => theme[filterKey as keyof ShopifyTheme] == filterValue);
    } 
    
    return result;
}

export function ThemesList() {
    const { themes, config } = useContext(PopupContext);
    const filteredThemes = useMemo(() => getFilteredThemes(themes, config), [themes, config]);
    return (
        <div style={{margin: '16px auto 0'}}>
            {
                filteredThemes.length > 0 ?
                filteredThemes.map((theme) => (<ThemesCard theme={theme} key={theme.id}></ThemesCard>)) :
                <div>There are no local themes</div>
            }
        </div>
    );
}