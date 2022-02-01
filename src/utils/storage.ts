import { ShopifyTheme } from '../components/PopupContext';

export function getLocalThemes():Promise<ShopifyTheme[]> {
    return new Promise((resolve, reject) => {
        try {
            const key = 'themes';
            chrome.storage.local.get(key, function(result) {
                if (result && result[key]) {
                    resolve(result[key].map((theme:any, i:number) => {
                        return {
                            name: `My theme ${i}`,
                            published: false,
                            developer: false,
                            id: `${i}`,
                        }
                    }));
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
    return true;
}

export default {}