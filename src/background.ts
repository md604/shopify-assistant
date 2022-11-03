import { 
    storageUpdateOriginalThemesData, 
    storageUpdateThemeMetaData,
    generateDummyThemes,
    removeDummyThemes
} from './utils/storage';
import { FifoPromiseQueue } from './utils/FifoPromiseQueueClass';



export interface CooldownMap {
    [key: string|number]: number
}

const filter = {
    url: [
        {
            urlMatches: 'https://.*myshopify.com/admin'
        },
    ],
};
const promiseQueue = new FifoPromiseQueue();
const FETCH_COOLDOWN_TIME:number = 1000 * 60 * 1; // 1 mins in ms
const shopCooldownMap:CooldownMap = {};

function isShopCooldownExpired(domainName: string):boolean {
    const now:number = Date.now();
    if (shopCooldownMap[domainName]) {
        if (now - shopCooldownMap[domainName] > FETCH_COOLDOWN_TIME) {
            shopCooldownMap[domainName] = now;
            return true;
        }
    } else {
        shopCooldownMap[domainName] = now;
        return true;
    }
    return false;
}

// site script
function fetchShopThemes(url:string, domainName:string) {
    fetch(url)
    .then(data => data.json())
    .then(data => {
        chrome.runtime.sendMessage(
            {
                type: 'newThemes',
                domainName,
                data,
                to: 'sw'
            }
        );
    })
    .catch(err => console.log(`Error when fetching themes in admin pannel: ${err}`));
}

// Listen for messages from the site
type MessageResponse = (response?: any) => void;
async function messageHandler(message:any, sender: chrome.runtime.MessageSender, sendResponse: MessageResponse) {
    if (message.to == 'sw' && message.type) {
        switch (message.type) {
            case 'newThemes': 
                // a message comes from the injected script that gets shopify themes
                storageUpdateOriginalThemesData({
                    domainName: message.domainName,
                    themes: message.data.themes ? message.data.themes : [] 
                });
            break;
            case 'updateThemeMeta': 
                promiseQueue.add(storageUpdateThemeMetaData.bind(null, message.data.theme ? message.data.theme : {}));
            break;
            default: console.log('Unknown message type');
        }
    } else {
        console.log('Message type is not present');
    }
}
chrome.runtime.onMessage.addListener(messageHandler);

chrome.webNavigation.onCompleted.addListener((details) => {
    const baseUrl = details.url.split('admin')[0], // https://.*myshopify.com/
        domainName = baseUrl.split('//')[1].replace('/',''), // shopname.myshopify.com
        themesUrl = `${baseUrl}admin/themes.json`;
    // console.info("The user has loaded my favorite website!", details.url, themesUrl);
    // Check if this site was visited recently
    if (isShopCooldownExpired(domainName)) {
        console.log('Shop is ready for a sync: ', domainName);
        // Run script on the content page
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: fetchShopThemes,
            args: [themesUrl,domainName]
        });
        setTimeout(()=>{
            chrome.webNavigation.getAllFrames(
                {
                    tabId: details.tabId 
                },
                (frames) => {
                    console.log('Frames: ', frames);
                    if (frames) {
                        for(let i=0; i < frames.length; i++){
                            if (frames[i].parentFrameId === 0 
                                && frames[i].url.indexOf('admin/online-store/themes') > 0) {
                                chrome.scripting.executeScript({
                                    target: { 
                                        tabId: details.tabId, 
                                        frameIds: [frames[i].frameId]
                                    },
                                    files: ['themesAdminData.js']
                                });        
                            }
                        }
                    }
                }
            );
        }, 7000);
        
        /*
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            files: ['themesAdminData.js']
        });
        */
    }
}, filter);

chrome.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        // do something after reloading extention
        
        //console.log('Reload extension');
        //generateDummyThemes(20, 20);
        //removeDummyThemes();
    }
    /*
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.storage.local.clear();
    }
    */
    /*
    chrome.contextMenus.create({
        "id": "sampleContextMenu",
        "title": "Sample Context Menu",
        "contexts": ["selection"]
    });
    */
});

export default {}