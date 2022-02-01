import { isShopRecentlySynced } from './utils/storage';

const filter = {
    url: [
        {
            urlMatches: 'https://.*myshopify.com/admin'
        },
    ],
};

// site script
function fetchThemes(url:string) {
    fetch(url)
    .then(data => data.json())
    .then(data => {
        chrome.storage.local.set({ themes: data.themes }, function() {
            console.log('Product object has been saved to a local storage: ', data.themes); 
        }); 
    });
}

chrome.webNavigation.onCompleted.addListener((details) => {
    const baseUrl = details.url.split('admin')[0], // https://.*myshopify.com/
        domainName = baseUrl.split('//')[1].replace('/',''), // shopname.myshopify.com
        themesUrl = `${baseUrl}admin/themes.json`;
    console.info("The user has loaded my favorite website!", details.url, themesUrl);
    // Check if this site was visited recently
    if (isShopRecentlySynced(domainName)) {
        console.log('Shop is ready for a sync: ', domainName);
    }
    // Run script on the content page
    chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: fetchThemes,
        args: [themesUrl]
    });

}, filter);

export {}