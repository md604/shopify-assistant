const filter = {
    url: [
        {
            urlMatches: 'https://gerarddarel.com/products/pull-gilet-douce_5718',
        },
    ],
};

chrome.webNavigation.onCompleted.addListener(() => {
    console.info("The user has loaded my favorite website!");
    fetch('https://gerarddarel.com/products/pull-gilet-douce_5718.json')
    .then(data => data.json())
    .then(data => {
        chrome.storage.local.set({ product: data.product }, function() {
            console.log('Product object has been saved to a local storage: ', data.product); 
        });
    })
}, filter);

export {}