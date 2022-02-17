import { Document, EnrichedDocumentSearchResultSetUnit, SimpleDocumentSearchResultSetUnit } from 'flexsearch';
import { getLocalThemes } from './utils/storage';
import { ShopifyTheme } from './utils/interfaces';

// search index is always defined and available
let indexShopifyThemes = new Document<ShopifyTheme, true>({
    document: {
        id: "id",
        index: ["name"],
        store: true
    }
});

// receive a search query message function
// send a search query message function
// add documents to the search index function
async function addShopifyThemesToIndex():Promise<void> {
        const localThemes:ShopifyTheme[] = await getLocalThemes();
        for(let i=0; i < localThemes.length; i++) {
            console.log('Indexed theme: ', localThemes[i]);
            indexShopifyThemes.add(localThemes[i]);
        }
}

// get search results function
//SimpleDocumentSearchResultSetUnit[]
async function getSearchResults(query:string):Promise<EnrichedDocumentSearchResultSetUnit<ShopifyTheme>[]> {
    return indexShopifyThemes.searchAsync(query, { enrich: true });
}

// add themes to index
addShopifyThemesToIndex();

// create event bus
addEventListener('message', e => {
    if (e.data === 'hello') {
      postMessage(`world`);
    }
});

export {}