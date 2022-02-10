import { Document, SimpleDocumentSearchResultSetUnit } from 'flexsearch';
import { getLocalThemes } from './storage';
import { ShopifyTheme } from './interfaces'; 

// search index
const index = new Document({
    document: {
        id: "id",
        index: ["name"]
    }
});
console.log('init search index');

// receive a search query message function
// send a search query message function
// create document data model function
// add documents to the search index function
export async function addSearchThemesToIndex():Promise<void> {
    const searchThemes:ShopifyTheme[] = await getLocalThemes();
    for(let i=0; i < searchThemes.length; i++) {
        index.add(searchThemes[i]);
    }
};
// get search results function
export async function getSearchResults(query:string):Promise<SimpleDocumentSearchResultSetUnit[]> {
    return index.searchAsync(query);
};

export {};