import { 
    ShopifyTheme, 
    StorageThemesData,
    ThemeMeta,
    defaultThemeMeta 
} from './interfaces';

/*
Storage model:
{
    shops: {
        'xxx.myshopify.com': {
            themes: {
                'theme_1_id': { theme_1 obj - raw shopify data }, 
                'theme_2_id': { theme_2 obj - raw shopify data },
                ...
            },
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

const SHOPS_KEY:string = 'shops',
    SHOP_THEMES_KEY:string = 'themes', 
    SHOP_THEMES_META_KEY:string = 'themesMeta',
    DUMMY_SHOP_PREFIX:string = 'dummy-shop-';

//const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key];
//const getTypeKey = <U extends keyof T>(key: U) => key;

// Note: for testing needs it's preferable to implement all critical functionality as pure functions
// Pure functions start

export function transformStorageShopsDataToShopifyThemes(storageData:any):ShopifyTheme[] {
    let allThemes:ShopifyTheme[] = [];
    const domainList:string[] = Object.keys(storageData[SHOPS_KEY]);
    
    for (let i:number = 0; i < domainList.length; i++) {
        let domainName:string = domainList[i];
        storageData[SHOPS_KEY][domainName][SHOP_THEMES_META_KEY] ??= {};

        const domainThemesMeta = storageData[SHOPS_KEY][domainName][SHOP_THEMES_META_KEY], 
            initDomainThemes = storageData[SHOPS_KEY][domainName][SHOP_THEMES_KEY],
            initDomainThemesIds:string[] = Object.keys(initDomainThemes),
            domainThemes:ShopifyTheme[] = initDomainThemesIds.map((themeId) => {
                const theme:any = initDomainThemes[themeId]; 
                // compose a ShopifyTheme object based on raw and meta data from the storage 
                const themeMeta:ThemeMeta = domainThemesMeta[theme.id] ? 
                    { ...defaultThemeMeta, ...domainThemesMeta[theme.id] }
                    :
                    defaultThemeMeta;
                return {
                    name: theme.name,
                    domainName,
                    lastUpdate: Date.parse(theme.updated_at),
                    published: theme.role == 'main' ? true : false,
                    developer: false,
                    id: theme.id,
                    pinned: themeMeta['pinned'],
                    available: themeMeta['available'],
                    tags: themeMeta['tags']
                }
            });
        allThemes = [...allThemes, ...domainThemes];
    }

    return allThemes;
}

export function getUpdatedStorageShops(newThemeData:StorageThemesData, currentShopsData:any) {
    // themes - data fetched from the Shopify API endpoint themes.json
    // domainName - a domain where fetch was performed
    const { domainName, themes } = newThemeData; // themes: Array<any>
    const shop = { [domainName]: {themes: {} as any } };
    
    if (currentShopsData && currentShopsData[SHOPS_KEY] && currentShopsData[SHOPS_KEY][domainName]) {
        const storeShop:any = currentShopsData[SHOPS_KEY][domainName];
        storeShop[SHOP_THEMES_META_KEY] ??= {};
        storeShop[SHOP_THEMES_KEY] ??= {};
        // 1. create a list of fetched theme ids from a shopify site
        const storeThemesIds: any[] = Object.keys(storeShop[SHOP_THEMES_KEY]);
        // 2. mark store themes that do not exist in fetch results as not available (aka 'gone')
        //    first mark all themes as outdated / unavailable
        //    then mark new themes as actual ones / available
        //    complexity: O(2n)
        for(let i = 0; i < storeThemesIds.length; i++) {
            storeShop[SHOP_THEMES_META_KEY][storeThemesIds[i]] ??= {};
            storeShop[SHOP_THEMES_META_KEY][storeThemesIds[i]]['available'] = false;
        }
        for(let i = 0; i < themes.length; i++) {
            // replace existing themes data by a new one
            storeShop[SHOP_THEMES_KEY][themes[i].id] = themes[i];
            // update new meta
            storeShop[SHOP_THEMES_META_KEY][themes[i].id] ??= {};
            storeShop[SHOP_THEMES_META_KEY][themes[i].id]['available'] = true;
        }
        // merge existing store themes and new themes
        shop[domainName] = storeShop;
    } else {
        for(let i = 0; i < themes.length; i++) {
            shop[domainName]['themes'][themes[i].id] = themes[i];
        }
    }

    return { ...currentShopsData[SHOPS_KEY], ...shop };
}

export function getUpdatedStorageShopsWithNewThemeMeta(domainName: string, id: number, themeMeta: ThemeMeta, currentShopsData:any) {
    let shop:any = {};

    if (currentShopsData && currentShopsData[SHOPS_KEY] && currentShopsData[SHOPS_KEY][domainName]) {
        const storeShop:any = currentShopsData[SHOPS_KEY][domainName];
        storeShop[SHOP_THEMES_META_KEY] ??= {};
        storeShop[SHOP_THEMES_META_KEY][id] = {...themeMeta};
        shop[domainName] = {...storeShop};
    }

    return { ...currentShopsData[SHOPS_KEY], ...shop };
}

export function deleteTheme(domainName: string, id: number, currentShopsData:any) {
    const storeShop:any = currentShopsData[SHOPS_KEY][domainName];

    delete storeShop[SHOP_THEMES_META_KEY][id];
    delete storeShop[SHOP_THEMES_KEY][id];

    return { ...currentShopsData[SHOPS_KEY], [domainName]: storeShop };
}

// Pure functions end

export function getLocalThemes():Promise<ShopifyTheme[]> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(SHOPS_KEY, function(result) {
                if (chrome.runtime.lastError) {
                    throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
                } 
                if (result && result[SHOPS_KEY]) {
                    const allThemes = transformStorageShopsDataToShopifyThemes(result);
                    resolve(allThemes);
                } else {
                    console.log(`Can't find a root object "${SHOPS_KEY}" in the storage (getLocalThemes function)`);
                    resolve([]);
                }
            });
        } catch (err) {
            console.log('Local storage error: ', err);
            reject([]);
        }
    });
}
 
export function storageUpdateOriginalThemesData(data:StorageThemesData):Promise<boolean> {
    return new Promise((resolve,reject) => {
        try {
            chrome.storage.local.get(SHOPS_KEY, function(result) {
                if (chrome.runtime.lastError) {
                    throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
                }
                
                const shops = getUpdatedStorageShops(data, result);
        
                chrome.storage.local.set({ shops }, function() {
                    if (chrome.runtime.lastError) {
                        // will last catch get this error?
                        throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
                    }
                    // console.log('Shops data has been updated in a local storage: ', shops);
                    resolve(true); 
                });
            });
        } catch (err) {
            console.log('Local storage, update theme meta data error: ', err);
            reject(false);
        }
    });
}

export function storageUpdateThemeMetaData(theme: ShopifyTheme):Promise<ThemeMeta> {
    const themeMeta:any = {},
        { domainName, id } = theme;
    let metaKey: keyof ThemeMeta;

    for(metaKey in defaultThemeMeta) {
        themeMeta[metaKey] = theme[metaKey];
    }
    
    return new Promise((resolve,reject) => {
        try {
            chrome.storage.local.get(SHOPS_KEY, function(result) {
                if (chrome.runtime.lastError) {
                    throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
                }

                const shops = getUpdatedStorageShopsWithNewThemeMeta(domainName,id,themeMeta, result);

                chrome.storage.local.set({ shops }, function() {
                    if (chrome.runtime.lastError) {
                        // will last catch get this error?
                        throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
                    }
                    resolve(themeMeta);
                    // console.log('Shops data has been updated in a local storage: ', shops);
                });
            });
        } catch (err) {
            console.log('Local storage, update theme meta data error: ', err);
            reject(themeMeta);
        }
    });
}

export function storageDeleteThemeData(theme: ShopifyTheme):boolean {
    let storageUpdateResult:boolean = false;
    const { domainName, id } = theme;
    chrome.storage.local.get(SHOPS_KEY, function(result) {
        if (chrome.runtime.lastError) {
            throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
        }
        if (result && result[SHOPS_KEY] && result[SHOPS_KEY][domainName]) {
            
            const shops = deleteTheme(domainName, id, result);

            chrome.storage.local.set({ shops }, function() {
                if (chrome.runtime.lastError) {
                    // will last catch get this error?
                    throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
                }
                console.log(`Theme ${id} has been deleted from a local storage: `, shops);
                storageUpdateResult = true; 
            });  
        } 
    });
    return storageUpdateResult;
}

// Test functions

// on extention reload event it populates the store 
// with a dummy theme's data if it does not already exist there

function generateDummyTheme(themeIndex = 0, shopIndex = 0):any {
    const themeId = 100000000000 + shopIndex * 1000 + themeIndex,
        shopId = 100 + shopIndex,
        randomWords = [
            'car', 
            'sale', 
            'new', 
            'irresistable', 
            'test', 
            'dev', 
            'feature', 
            'release',
            'flesh',
            'backup'
        ],
        randomWord = randomWords[Math.floor(Math.random() * randomWords.length)],
        currentDate = new Date().toISOString().split('.')[0] + '-04:00';
    let themeRole = 'unpublished';
    
    if (themeIndex === 0) {
        themeRole = 'main';
    } 
    /*
    else if (themeIndex === 1) {
        themeRole = 'main';
    }
    */
    return {
        id: themeId,
        name: `Dummy theme ${themeIndex}: ${randomWord}`,
        created_at: currentDate,
        updated_at: currentDate,
        role: themeRole,
        theme_store_id: shopId,
        previewable: true,
        processing: false,
        admin_graphql_api_id: `gid:\/\/shopify\/Theme\/${themeId}`
    };
}

export async function generateDummyThemes(numberOfShops = 5, numberOfThemes = 20) {
    for(let i = 0; i < numberOfShops; i++) {
        const themes = [];
        for(let j = 0; j < numberOfThemes; j++){
            themes.push(generateDummyTheme(j, i));
        }
        
        await storageUpdateOriginalThemesData({
            domainName: `${DUMMY_SHOP_PREFIX}${i}.myshopify.com`, 
            themes
        });

        console.log(`Dummy shop ${i}`, {
            domainName: `${DUMMY_SHOP_PREFIX}${i}.myshopify.com`, 
            themes
        });
    }
}

// removes all dummy data from the store

export function removeDummyThemes() {
    let storageUpdateResult:boolean = false;
    chrome.storage.local.get(SHOPS_KEY, function(result) {
        if (chrome.runtime.lastError) {
            throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
        }
        if (result && result[SHOPS_KEY]) {
            const shopDomains = Object.keys(result[SHOPS_KEY]);

            for (let i = 0; i < shopDomains.length; i++) {
                if (shopDomains[i].match(DUMMY_SHOP_PREFIX)) {
                    delete result[SHOPS_KEY][shopDomains[i]];
                }
            }
            
            chrome.storage.local.set({ shops: {...result[SHOPS_KEY]} }, function() {
                if (chrome.runtime.lastError) {
                    // will last catch get this error?
                    throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
                }
                console.log(`Dummy themes have been deleted from a local storage: `, {...result[SHOPS_KEY]});
                storageUpdateResult = true;
            });
        }
    });
    return storageUpdateResult;
}

export default {}