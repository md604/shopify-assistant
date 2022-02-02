import { ThemeStoreMajor } from '@shopify/polaris-icons';
import { ShopifyTheme } from '../components/PopupContext';

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
                                return {
                                    name: theme.name,
                                    published: theme.role == 'main' ? true : false,
                                    developer: false,
                                    id: theme.id,
                                }
                            });
                        allThemes = [...allThemes, ...domainThemes];
                    }
                    
                    resolve(allThemes);
                } else {
                    console.log('Unvalid results in getLocalThemes function');
                    reject([]);
                }
            });
        } catch (err) {
            console.log('Local storage error: ', err);
            reject([]);
        }
    });
}

export function isShopRecentlySynced(shopDomain:string):boolean {
    return false;
}

export default {}