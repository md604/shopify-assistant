import { storageUpdateOriginalThemesData } from './utils/storage';

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

const FETCH_COOLDOWN_TIME:number = 1000 * 60 * 10; // 10 mins in ms
const shopCooldownMap:CooldownMap = {};

function isFetchAvailable(domainName: string):boolean {
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
function fetchThemes(url:string, domainName:string) {
    fetch(url)
    .then(data => data.json())
    .then(data => {
        chrome.storage.local.get('shops', function(result) {
            if (chrome.runtime.lastError) {
                throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
            }
            let shop = { [domainName]: { themes: data.themes } }, 
                shops = {};
            if (result && result['shops'] && result['shops'][domainName]) {
                shop[domainName] = {...result['shops'][domainName], ...shop[domainName]};
            } 
            shops = { ...result['shops'], ...shop };
            chrome.storage.local.set({ shops }, 
            function() {
                if (chrome.runtime.lastError) {
                    // will last catch get this error?
                    throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
                }
                console.log('Shops data has been updated in a local storage: ', shops); 
            });
        }); 
    })
    .catch(err => console.log('Error when fetching themes in admin pannel: ', err));
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
                data
            }
        );
    })
    .catch(err => console.log(`Error when fetching themes in admin pannel: ${err}`));
}

// Listen for messages from the site
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.type) {
            switch (message.type) {
                case 'newThemes': 
                console.log('Got a message of type THEMES', message.data);
                storageUpdateOriginalThemesData({
                    domainName: message.domainName,
                    themes: message.data.themes ? message.data.themes : [] 
                });
                break;
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
    if (isFetchAvailable(domainName)) {
        console.log('Shop is ready for a sync: ', domainName);
        // Run script on the content page
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchShopThemes,
            args: [themesUrl,domainName]
        });
    }
    /*
    if (!isShopRecentlySynced(domainName)) {
        console.log('Shop is ready for a sync: ', domainName);
        // Run script on the content page
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchThemes,
            args: [themesUrl, domainName]
        });
    }
    */

}, filter);

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason == 'install') {
        // clean local storage
        chrome.storage.local.clear();
    }
    /*
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
    */
});

export default {}