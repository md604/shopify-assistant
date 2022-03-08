import React, { useState, useContext, useEffect } from 'react';
import { ShopifyTheme } from '../utils/interfaces';
//import { Card } from '@shopify/polaris';
import { PopupContext } from './PopupContext';
//import { ShopifyTheme } from '../utils/interfaces';
import { ThemesCard } from './ThemesCard';

export function ThemesList() {
    const { themes, config } = useContext(PopupContext);
    const [filteredThemes, setFilteredThemes] = useState(themes);
    useEffect(() => {
        const tabFilterProps = Object.keys(config.tabFilterThemeProperty);
        if (tabFilterProps.length > 0){
            const filterKey = tabFilterProps[0],
                filterValue = config.tabFilterThemeProperty[filterKey as keyof ShopifyTheme],
                filterThemesResult = themes.filter(theme => theme[filterKey as keyof ShopifyTheme] == filterValue);
            setFilteredThemes(filterThemesResult);
        } else {
            setFilteredThemes(themes);
        }
        console.log('Config value: ', config, filteredThemes, themes);
    },[config]);
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