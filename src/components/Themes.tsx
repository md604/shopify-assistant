import React, { useState, useCallback, useEffect , useContext } from 'react';
import {
    FormLayout,
    TextField,
    Icon
  } from '@shopify/polaris';
import { SearchMinor } from '@shopify/polaris-icons';
import { ThemesList } from './ThemesList';
import { PopupContext } from './PopupContext';

export function Themes() {
    const [filterQuery, setFilterQuery] = useState('');
    const handleFilterQueryChange = useCallback((value) => setFilterQuery(value), []);
    const handleFilterQueryClear = useCallback(() => {
        setFilterQuery('');
        resetThemes();
        console.log('Clear search query and show full theme list');
    }, []);
    const { config, resetThemes, getSearchWorker } = useContext(PopupContext);

    useEffect(() => { 
        if (getSearchWorker) {
            const searchWorker = getSearchWorker();
            searchWorker.postMessage(
                {   
                    type: 'searchQuery',
                    query: filterQuery,
                    to: 'sw'
                }
            );
            console.log('You typed: ', filterQuery);
        }
    },[filterQuery]);
    
    return (
        <div>
            <FormLayout>
                <div style={{height: '5px'}}></div>
                <TextField
                value={filterQuery}
                disabled={!config.enableSearchBar}
                label="Filter themes"
                labelHidden
                clearButton
                placeholder="Use theme's names or tags..."
                onChange={handleFilterQueryChange}
                onClearButtonClick={handleFilterQueryClear}
                autoComplete="given-name"
                prefix={
                    <Icon source={SearchMinor} />
                }
                />
            </FormLayout>
            <ThemesList></ThemesList>
        </div>
    );
}