import React, { useContext, useEffect, useMemo } from 'react';
import { AppConfig, ShopifyTheme } from '../utils/interfaces';
import { PopupContext } from './PopupContext';
import { ThemesInfiniteScroll } from './ThemesInfiniteScroll';

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
    const { themes, config, updateThemeCounter } = useContext(PopupContext);
    const filteredThemes = useMemo(() => getFilteredThemes(themes, config), [themes, config]);
    // useEffect(() => {
    //     console.log(config);
    // },[config]);
    useEffect(() => {
        updateThemeCounter(filteredThemes.length);
    },[filteredThemes]);
    return (
        <div style={{margin: '16px auto 0'}}>
            {
                filteredThemes.length > 0 ?
                <ThemesInfiniteScroll tabThemes={filteredThemes}></ThemesInfiniteScroll> :
                <div>There are no local themes</div>
            }
        </div>
    );
}