const filter = {
    url: [
        {
            urlMatches: 'https://.*myshopify.com/admin'
        },
    ],
};

chrome.webNavigation.onCompleted.addListener((details) => {
    const themesUrl = `${details.url.split('admin')[0]}admin/themes.json`;
    console.info("The user has loaded my favorite website!", details.url, themesUrl);
    /*
    fetch('https://gerarddarel.com/products/pull-gilet-douce_5718.json')
    .then(data => data.json())
    .then(data => {
        chrome.storage.local.set({ product: data.product }, function() {
            console.log('Product object has been saved to a local storage: ', data.product); 
        });
    })
    */
}, filter);

export {}