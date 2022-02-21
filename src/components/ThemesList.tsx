import React, { useState, useContext, useCallback } from 'react';
//import { Card } from '@shopify/polaris';
import { PopupContext } from './PopupContext';
//import { ShopifyTheme } from '../utils/interfaces';
import { ThemesCard } from './ThemesCard';

export function ThemesList() {
    //const [visibleThemes, setVisibleThemes] = useState([]);
    const { themes } = useContext(PopupContext);
    return (
        <div style={{margin: '16px auto 0'}}>
            {
                themes.length > 0 ?
                themes.map((theme) => (<ThemesCard theme={theme} key={theme.id}></ThemesCard>)) :
                <div>There are no local themes</div>
            }
        </div>
    );
}