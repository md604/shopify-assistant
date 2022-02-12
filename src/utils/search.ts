import { Document, SimpleDocumentSearchResultSetUnit } from 'flexsearch';
import { getLocalThemes } from './storage';
import { ShopifyTheme } from './interfaces'; 

// search index is always defined and available
let indexShopifyThemes = new Document({
    document: {
        id: "id",
        index: ["name"]
    }
});
// counts a number of documents in the search index
let indexShopifyThemesEntriesNumber:number = 0;

// receive a search query message function
// send a search query message function
// add documents to the search index function
export async function addShopifyThemesToIndex():Promise<void> {
    if (indexShopifyThemesEntriesNumber == 0) {
        const searchThemes:ShopifyTheme[] = await getLocalThemes();
        for(let i=0; i < searchThemes.length; i++) {
            indexShopifyThemes.add(searchThemes[i]);
            indexShopifyThemesEntriesNumber++; // count added entry
        }
    }
};
export function getIndexShopifyThemesEntriesNumber():number {
    return indexShopifyThemesEntriesNumber;
}
// get search results function
export async function getSearchResults(query:string):Promise<SimpleDocumentSearchResultSetUnit[]> {
    return indexShopifyThemes.searchAsync(query);
};

export {};