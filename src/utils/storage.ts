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

export function getLocalThemes():Promise<ShopifyTheme[]> {
    return new Promise((resolve, reject) => {
        try {
            const shopsKey:string = 'shops', 
                shopThemesKey:string = 'themes', 
                shopThemesMetaKey:string = 'themesMeta',
                defaultThemeMeta:ThemeMeta = {
                    available: false,
                    tags: []
                };
            chrome.storage.local.get(shopsKey, function(result) {
                if (chrome.runtime.lastError) {
                    throw new Error(`Failed to call a get storage API, ${chrome.runtime.lastError.message}`);
                } 
                if (result && result[shopsKey]) {
                    let allThemes:ShopifyTheme[] = [];
                    const domainList:string[] = Object.keys(result[shopsKey]);
                    
                    for (let i:number = 0; i < domainList.length; i++) {
                        let domainName:string = domainList[i];
                        result[shopsKey][domainName][shopThemesMetaKey] ??= {};

                        const domainThemesMeta = result[shopsKey][domainName][shopThemesMetaKey], 
                            initDomainThemes = result[shopsKey][domainName][shopThemesKey],
                            domainThemes:ShopifyTheme[] = initDomainThemes.map((theme:any) => {
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
                                    pinned: false,
                                    id: theme.id,
                                    available: themeMeta['available'],
                                    tags: themeMeta['tags']
                                }
                            });
                        allThemes = [...allThemes, ...domainThemes];
                    }

                    resolve(allThemes);
                } else {
                    console.log(`Can't find a root object "${shopsKey}" in the storage (getLocalThemes function)`);
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
        
        if (result && result['shops'] && result['shops'][domainName]) {
            const storeShop:any = result['shops'][domainName];
            // 1. create a list of fetched theme ids from a shopify site
            const newThemesIds: string[] = themes.map((theme:any) => theme.id);
            const storeThemesIds: string[] = Object.keys(storeShop['themes']);
            // 2. mark store themes that do not exist in fetch results as not available (aka 'gone')
            //    first mark all themes as outdated / unavailable
            //    then mark new themes as actual ones / available
            //    complexity: O(2n)
            storeShop['themesMeta'] ??= {};
            for(let i = 0; i < storeThemesIds.length; i++) {
                storeShop['themesMeta'][storeThemesIds[i]] ??= {};
                storeShop['themesMeta'][storeThemesIds[i]]['available'] = false;
            }
            for(let i = 0; i < newThemesIds.length; i++) {
                storeShop['themesMeta'][storeThemesIds[i]] ??= {};
                storeShop['themesMeta'][newThemesIds[i]]['available'] = true;
            }
            // merge existing store themes and new themes
            shop[domainName] = {...storeShop, ...shop[domainName]};
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

export function storageUpdateThemeMetaData(
    domainName: ShopifyTheme['domainName'], 
    themeId:ShopifyTheme['id'], 
    metaData: Partial<ThemeMeta>):Promise<ThemeMeta> {

    return new Promise((resolve,reject) => {
        resolve(defaultThemeMeta);
    });
}

export default {}