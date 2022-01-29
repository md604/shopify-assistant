import React, {useState, useCallback} from 'react';
import {
    FormLayout,
    TextField,
  } from '@shopify/polaris';
import { ThemesList } from './ThemesList';

export function Themes() {
    const [filterQuery, setFilterQuery] = useState('');
  
    const handleFilterQueryChange = useCallback((value) => setFilterQuery(value), []);
    
    return (
        <div>
            <FormLayout>
                <div style={{height: '5px'}}></div>
                <TextField
                value={filterQuery}
                label="Filter themes"
                labelHidden
                placeholder="Use theme's names or tags..."
                onChange={handleFilterQueryChange}
                autoComplete="given-name"
                />
            </FormLayout>
            <ThemesList></ThemesList>
        </div>
    );
}