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

const SHOPS_KEY:string = 'shops',
    SHOP_THEMES_KEY:string = 'themes', 
    SHOP_THEMES_META_KEY:string = 'themesMeta';

//const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) => obj[key];
//const getTypeKey = <U extends keyof T>(key: U) => key;

export function getLocalThemes():Promise<ShopifyTheme[]> {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.local.get(SHOPS_KEY, function(result) {
                if (chrome.runtime.lastError) {
                    throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
                } 
                if (result && result[SHOPS_KEY]) {
                    let allThemes:ShopifyTheme[] = [];
                    const domainList:string[] = Object.keys(result[SHOPS_KEY]);
                    
                    for (let i:number = 0; i < domainList.length; i++) {
                        let domainName:string = domainList[i];
                        result[SHOPS_KEY][domainName][SHOP_THEMES_META_KEY] ??= {};

                        const domainThemesMeta = result[SHOPS_KEY][domainName][SHOP_THEMES_META_KEY], 
                            initDomainThemes = result[SHOPS_KEY][domainName][SHOP_THEMES_KEY],
                            initDomainThemesIds:string[] = Object.keys(initDomainThemes),
                            domainThemes:ShopifyTheme[] = initDomainThemesIds.map((themeId) => {
                                const theme:any = initDomainThemes[themeId]; 
                                // compose a ShopifyTheme object based on raw and meta data from the storage 
                                const themeMeta:ThemeMeta = domainThemesMeta[theme.id] ? 
                                    domainThemesMeta[theme.id]
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

export function storageUpdateOriginalThemesData(data:StorageThemesData):boolean {
    let storageUpdateResult:boolean = false;
    const { domainName, themes } = data;
    chrome.storage.local.get(SHOPS_KEY, function(result) {
        if (chrome.runtime.lastError) {
            throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
        }

        let shop = { [domainName]: {themes: {} as any } }, 
            shops = {};
            
        for(let i = 0; i < themes.length; i++) {
            shop[domainName]['themes'][themes[i].id] = themes[i];
        }
        
        if (result && result[SHOPS_KEY] && result[SHOPS_KEY][domainName]) {
            const storeShop:any = result[SHOPS_KEY][domainName];
            // 1. create a list of fetched theme ids from a shopify site
            // const newThemesIds: string[] = themes.map((theme:any) => theme.id);
            // const storeThemesIds: string[] = Object.keys(storeShop[SHOP_THEMES_KEY]);
            // const storeThemesIds: string[] = storeShop[SHOP_THEMES_KEY].map((theme:any) => theme.id);
            const storeThemes: any[] = storeShop[SHOP_THEMES_KEY];
            // 2. mark store themes that do not exist in fetch results as not available (aka 'gone')
            //    first mark all themes as outdated / unavailable
            //    then mark new themes as actual ones / available
            //    complexity: O(2n)
            storeShop[SHOP_THEMES_META_KEY] ??= {};
            storeShop[SHOP_THEMES_KEY] ??= {};
            for(let i = 0; i < storeThemes.length; i++) {
                storeShop[SHOP_THEMES_META_KEY][storeThemes[i].id] ??= {};
                storeShop[SHOP_THEMES_META_KEY][storeThemes[i].id]['available'] = false;
            }
            for(let i = 0; i < themes.length; i++) {
                // replace existing themes data by a new one
                storeShop[SHOP_THEMES_KEY][themes[i].id] = themes[i];
                // update new meta
                storeShop[SHOP_THEMES_META_KEY][themes[i].id] ??= {};
                storeShop[SHOP_THEMES_META_KEY][themes[i].id]['available'] = true;
            }
            console.log('Mergin old and new theme data old vs new: ', storeShop, shop);
            // merge existing store themes and new themes
            shop[domainName] = storeShop; //{...storeShop, ...shop[domainName]};
        }

        shops = { ...result[SHOPS_KEY], ...shop };

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

export function storageUpdateThemeMetaData(theme: ShopifyTheme):Promise<ThemeMeta> {
    const { domainName, id } = theme,
        themeMeta:any = {};
    
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
        
                let shop:any = {}, 
                    shops:any = {};
                
                if (result && result[SHOPS_KEY] && result[SHOPS_KEY][domainName]) {
                    const storeShop:any = result[SHOPS_KEY][domainName];
                    storeShop[SHOP_THEMES_META_KEY] ??= {};
                    storeShop[SHOP_THEMES_META_KEY][id] = themeMeta;
                    shop[domainName] = {...storeShop};
                }
        
                shops = { ...result[SHOPS_KEY], ...shop };
        
                chrome.storage.local.set({ shops }, function() {
                    if (chrome.runtime.lastError) {
                        // will last catch get this error?
                        throw new Error(`Failed to call storage API, ${chrome.runtime.lastError.message}`);
                    }
                    resolve(themeMeta);
                    console.log('Shops data has been updated in a local storage: ', shops);
                });
            });
        } catch (err) {
            console.log('Local storage, update theme meta data error: ', err);
            reject(themeMeta);
        }
    });
}

export default {}