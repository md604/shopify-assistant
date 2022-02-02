import { isShopRecentlySynced } from './utils/storage';

const filter = {
    url: [
        {
            urlMatches: 'https://.*myshopify.com/admin'
        },
    ],
};

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

chrome.webNavigation.onCompleted.addListener((details) => {
    const baseUrl = details.url.split('admin')[0], // https://.*myshopify.com/
        domainName = baseUrl.split('//')[1].replace('/',''), // shopname.myshopify.com
        themesUrl = `${baseUrl}admin/themes.json`;
    console.info("The user has loaded my favorite website!", details.url, themesUrl);
    // Check if this site was visited recently
    if (!isShopRecentlySynced(domainName)) {
        console.log('Shop is ready for a sync: ', domainName);
        // Run script on the content page
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchThemes,
            args: [themesUrl, domainName]
        });
    }

}, filter);

export {}