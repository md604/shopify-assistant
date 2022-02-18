import { storageUpdateOriginalThemesData } from './utils/storage';
import { ShopifyTheme } from './utils/interfaces';
import { getSearchResults, 
    addShopifyThemesToIndex,
    getIndexShopifyThemesEntriesNumber } from './utils/search';
import { EnrichedDocumentSearchResultSetUnit } from 'flexsearch';

const filter = {
    url: [
        {
            urlMatches: 'https://.*myshopify.com/admin'
        },
    ],
};

export interface CooldownMap {
    [key: string|number]: number
}

const FETCH_COOLDOWN_TIME:number = 1000 * 60 * 1; // 1 mins in ms
const shopCooldownMap:CooldownMap = {};

function isShopCooldownExpired(domainName: string):boolean {
    const now:number = Date.now();
    if (shopCooldownMap[domainName]) {
        if (now - shopCooldownMap[domainName] > FETCH_COOLDOWN_TIME) {
            shopCooldownMap[domainName] = now;
            return true;
        }
    } else {
        shopCooldownMap[domainName] = now;
        return true;
    }
    return false;
}

// site script
function fetchShopThemes(url:string, domainName:string) {
    fetch(url)
    .then(data => data.json())
    .then(data => {
        chrome.runtime.sendMessage(
            {
                type: 'newThemes',
                domainName,
                data,
                to: 'sw'
            }
        );
    })
    .catch(err => console.log(`Error when fetching themes in admin pannel: ${err}`));
}

// Listen for messages from the site
chrome.runtime.onMessage.addListener(
    async function(message, sender, sendResponse) {
        if (message.to == 'sw' && message.type) {
            switch (message.type) {
                /*
                case 'createSearchIndex':
                    console.log('Docs in the index before adding: ', getIndexShopifyThemesEntriesNumber());
                    await addShopifyThemesToIndex();
                    console.log('Docs in the index after adding: ', getIndexShopifyThemesEntriesNumber());
                    chrome.runtime.sendMessage(
                        {
                            type: 'updateSearchState',
                            value: true,
                            to: 'popup'
                        }
                    );    
                break;
                */
                case 'newThemes': 
                    // a message comes from the injected script that picks shopify themes
                    console.log('Got a message of type THEMES', message.data);
                    storageUpdateOriginalThemesData({
                        domainName: message.domainName,
                        themes: message.data.themes ? message.data.themes : [] 
                    });
                break;
                /*
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
                        
                        chrome.runtime.sendMessage(
                            {
                                type: 'searchResults',
                                results: themes,
                                to: 'popup'
                            }
                        );    
                    }
                break;
                */
                default: console.log('Unknown message type');
            }
        } else {
            console.log('Message type is not present');
        }
    }
);

chrome.webNavigation.onCompleted.addListener((details) => {
    const baseUrl = details.url.split('admin')[0], // https://.*myshopify.com/
        domainName = baseUrl.split('//')[1].replace('/',''), // shopname.myshopify.com
        themesUrl = `${baseUrl}admin/themes.json`;
    console.info("The user has loaded my favorite website!", details.url, themesUrl);
    // Check if this site was visited recently
    if (isShopCooldownExpired(domainName)) {
        console.log('Shop is ready for a sync: ', domainName);
        // Run script on the content page
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchShopThemes,
            args: [themesUrl,domainName]
        });
    }
}, filter);

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        // create new search index
        // await addShopifyThemesToIndex();
        //console.log(ServiceWorker.state);
    }
    /*
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.storage.local.clear();
    }
    */
    /*
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
    */
});

export default {}