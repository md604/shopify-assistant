import { Document, EnrichedDocumentSearchResultSetUnit, SimpleDocumentSearchResultSetUnit } from 'flexsearch';
import { getLocalThemes } from './utils/storage';
import { ShopifyTheme } from './utils/interfaces';
import { storageUpdateOriginalThemesData } from './utils/storage';

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

async function handleWorkerEvents(e:MessageEvent):Promise<void> {
    const message = e.data;
    if (message.type) {
        switch (message.type) {
            case 'createSearchIndex':
                //console.log('Docs in the index before adding: ', getIndexShopifyThemesEntriesNumber());
                await addShopifyThemesToIndex();
                //console.log('Docs in the index after adding: ', getIndexShopifyThemesEntriesNumber());
                self.postMessage(
                    {
                        type: 'updateSearchState',
                        value: true,
                        to: 'popup'
                    }
                );    
            break;
            case 'newThemes': 
                // a message comes from the injected script that picks shopify themes
                // console.log('Got a message of type THEMES', message.data);
                storageUpdateOriginalThemesData({
                    domainName: message.domainName,
                    themes: message.data.themes ? message.data.themes : [] 
                });
            break;
            case 'searchQuery':
                const results:EnrichedDocumentSearchResultSetUnit<ShopifyTheme>[] = await getSearchResults(message.query);
                console.log('(background js) Got a search querry and results:', results);
                if (results && results.length > 0) {
                    const themes:ShopifyTheme[] = [];
                    
                    for(let i = 0; i < results.length; i++){
                        for(let j = 0; j < results[i].result.length; j++){
                            themes.push(results[i].result[j].doc);
                        }
                    }
                    
                    self.postMessage(
                        {
                            type: 'searchResults',
                            results: themes,
                            to: 'popup'
                        }
                    );    
                }
            break;
            default: console.log('Unknown message type');
        }
    } else {
        console.log('Message type is not present');
    }
}
// add themes to index
addShopifyThemesToIndex();

// create event bus
self.addEventListener('message', handleWorkerEvents);

export {}