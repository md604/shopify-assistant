import React, {useState, useCallback} from 'react';
import {
    Card,
    FormLayout,
    TextField,
  } from '@shopify/polaris';

export function Themes() {
    const [filterQuery, setFilterQuery] = useState('');
  
    const handleFilterQueryChange = useCallback((value) => setFilterQuery(value), []);
  
    return (
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
    );
}