import { Index, Document } from 'flexsearch';
import { getLocalSearchThemes } from './storage';
import { SearchTheme } from './interfaces'; 
import { SimpleDocumentSearchResultSetUnit } from 'flexsearch';

// search index
const index = new Document({
    document: {
        id: "id",
        index: ["name"]
    }
});

// receive a search query message function
// send a search query message function
// create document data model function
// add documents to the search index function
export async function addSearchThemesToIndex():Promise<void> {
    const searchThemes:SearchTheme[] = await getLocalSearchThemes();
    for(let i=0; i < searchThemes.length; i++) {
        index.add(searchThemes[i]);
    }
};
// get search results function
export async function getSearchResults(query:string):Promise<SimpleDocumentSearchResultSetUnit[]> {
    return index.searchAsync(query);
};

export {};