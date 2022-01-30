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
    const themesUrl = `${details.url.split('admin')[0]}admin/themes.json`;
    console.info("The user has loaded my favorite website!", details.url, themesUrl);
   // Run script on the content page
   chrome.scripting.executeScript({
        target: { tabId: details.tabId },
        func: fetchThemes,
        args: [themesUrl]
    });

}, filter);

export {}