import { Document, EnrichedDocumentSearchResultSetUnit } from 'flexsearch';
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
function addShopifyThemesToIndex(themes:ShopifyTheme[]):void {
    for(let i=0; i < themes.length; i++) {
        indexShopifyThemes.add(themes[i]);
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
                addShopifyThemesToIndex(message.themes);
                self.postMessage(
                    {
                        type: 'enableSearchBar',
                        value: true,
                        to: 'popup'
                    }
                );    
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

// create event bus
self.addEventListener('message', handleWorkerEvents);

export {}