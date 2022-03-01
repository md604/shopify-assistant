import { 
    ShopifyTheme, 
    StorageThemesData 
} from './interfaces';

/*
Storage model:
{
    shops: {
        'xxx.myshopify.com': {
            themes: [
                { theme_1 obj - raw shopify data }, 
                { theme_2 obj - raw shopify data },
                ...
            ],
            themesMeta: {
                'theme_1_id': {
                    available: boolean,
                    tags: ['tag1', 'tag2', 'tag3', ...],
                    notes:[], <-- reserved for future versions
                    links:[]  <-- reserved for future versions
                },
                'theme_2_id': {...}
            }
        }
    }
}
*/

export function getLocalThemes():Promise<ShopifyTheme[]> {
    return new Promise((resolve, reject) => {
        try {
            const rootKey:string = 'shops', shopsKey:string = 'themes';
            chrome.storage.local.get(rootKey, function(result) {
                if (chrome.runtime.lastError) {
                    throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
                } 
                if (result && result[rootKey]) {
                    let allThemes:ShopifyTheme[] = [];
                    const domainList:string[] = Object.keys(result[rootKey]);
                    
                    for (let i:number = 0; i < domainList.length; i++) {
                        let domainName:string = domainList[i];
                        const initDomainThemes = result[rootKey][domainName][shopsKey],
                            domainThemes:ShopifyTheme[] = initDomainThemes.map((theme:any) => {
                                // compose a ShopifyTheme object based on raw and meta data from the storage 
                                return {
                                    name: theme.name,
                                    domainName,
                                    lastUpdate: Date.parse(theme.updated_at),
                                    published: theme.role == 'main' ? true : false,
                                    developer: false,
                                    pinned: false,
                                    id: theme.id,
                                }
                            });
                        allThemes = [...allThemes, ...domainThemes];
                    }

                    resolve(allThemes);
                } else {
                    console.log(`Can't find a root object "${rootKey}" in the storage (getLocalThemes function)`);
                    resolve([]);
                }
            });
        } catch (err) {
            console.log('Local storage error: ', err);
            reject([]);
        }
    });
}

export function storageUpdateOriginalThemesData(data:StorageThemesData):boolean {
    let storageUpdateResult:boolean = false;
    const { domainName, themes } = data;
    chrome.storage.local.get('shops', function(result) {
        if (chrome.runtime.lastError) {
            throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
        }

        let shop = { [domainName]: { themes } }, 
            shops = {};
        // 1. create a list of fetched theme ids from a shopify site
        // 2. mark store themes that do not exist in fetch results as not available (aka 'gone')
        if (result && result['shops'] && result['shops'][domainName]) {
            shop[domainName] = {...result['shops'][domainName], ...shop[domainName]};
        } 

        shops = { ...result['shops'], ...shop };

        chrome.storage.local.set({ shops }, function() {
            if (chrome.runtime.lastError) {
                // will last catch get this error?
                throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
            }
            console.log('Shops data has been updated in a local storage: ', shops);
            storageUpdateResult = true; 
        });
    });
    return storageUpdateResult;
}

export default {}