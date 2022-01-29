import { ShopifyTheme } from '../components/PopupContext';

export async function getLocalThemes():Promise<ShopifyTheme[]> {
    const result = await chrome.storage.local.get('themes');
    if (result && result.themes) {
        return result.themes.map((theme:any, i:number) => {
            return {
                name: `My theme ${i}`,
                published: false,
                developer: false,
                id: `${i}`,
            }
        });
    } 
    return [];
}

export default {}