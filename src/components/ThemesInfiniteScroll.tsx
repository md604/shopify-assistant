import React, { useState, useEffect, useMemo } from 'react';
import { ShopifyTheme } from '../utils/interfaces';
import { ThemesCard } from './ThemesCard';
import { useElementInView } from '../hooks/useElementInView';

const THEMES_BY_PAGE: number = 10;

export function ThemesInfiniteScroll(props: { tabThemes: ShopifyTheme[] }) {
    const [elementRef, isVisible] = useElementInView({
        root: null,
        rootMargin: '0px',
        threshold: [1.0]
    });
    const [currentPage, setCurrentPage] = useState<number>(1);
    const visibleThemes = useMemo(
        () => {
            const lastElement = currentPage * THEMES_BY_PAGE > props.tabThemes.length ?
            props.tabThemes.length : currentPage * THEMES_BY_PAGE;
            return props.tabThemes.slice(0, lastElement);
        }, 
        [props.tabThemes, currentPage]
    );

    useEffect(
        () => {
            if (isVisible && currentPage * THEMES_BY_PAGE < props.tabThemes.length) {
                setCurrentPage(currentPage + 1);
            }
        },
        [isVisible]
    );
    
    return (
        <>
            {
                visibleThemes.map((theme: ShopifyTheme) => (<ThemesCard theme={theme} key={theme.id}></ThemesCard>))
            }
            <div ref={elementRef as React.RefObject<HTMLDivElement>}></div>
        </>
    );
}