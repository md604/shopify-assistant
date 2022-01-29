import React, { useState, useContext } from 'react';
import {
        Card
    } from '@shopify/polaris';
import { ShopifyTheme, PopupContext } from './PopupContext';
/*
interface ThemesListProps {
    themes: ShopifyTheme[];
}
{ themes }:ThemesListProps
*/
export function ThemesList() {
    const [visibleThemes, setVisibleThemes] = useState([]);
    const { themes } = useContext(PopupContext);
    return (
        <div>
            {
                themes.length > 0 ?
                themes.map(theme => (
                    <Card title="Online store dashboard" sectioned>
                        <p>View a summary of your online store’s performance.</p>
                    </Card>
                )) :
                <div>There are no local themes</div>
            }
        </div>
    );
}