
import { 
    ShopifyTheme, 
    StorageThemesData,
    ThemeMeta,
    defaultThemeMeta 
} from '../src/utils/interfaces';
import { 
    transformStorageShopsDataToShopifyThemes,
    getUpdatedStorageShops,
    getUpdatedStorageShopsWithNewThemesMeta,
    deleteTheme
} from '../src/utils/storage';
import { 
    mockupStorage,
    mockupShopifyThemes,
    mockupStorageNewThemes,
    mockupUpdatedStorage,
    mockupUpdataedStorageWithNewThemeMeta,
    mockupStorageWithDeletedTheme,
    mockupShopifyThemeNewThemeMeta
} from './mockup_data';


describe("Storage API", () => {
    let testStorageData = JSON.parse(JSON.stringify(mockupStorage));

    afterEach(() => {
        // reset object changes after each test run
        testStorageData = JSON.parse(JSON.stringify(mockupStorage));
    });
    
    it("Transform storage data to ShopifyThemes", () => {
        const testResults = transformStorageShopsDataToShopifyThemes(testStorageData);
        expect(testResults).toMatchObject(mockupShopifyThemes);
    });
    
    it("Update storage data with new themes from themes.json API endpoint", () => {
        const shops = getUpdatedStorageShops(mockupStorageNewThemes, testStorageData);
        expect({shops}).toMatchObject(mockupUpdatedStorage);
    });
    
    it("Update meta data for selected themes", () => {
        const shops = getUpdatedStorageShopsWithNewThemesMeta([mockupShopifyThemeNewThemeMeta], testStorageData);
        console.log('Updated shop:', shops['test-shop.myshopify.com']['themesMeta']['105572627888']);
        expect({shops}).toMatchObject(mockupUpdataedStorageWithNewThemeMeta);
    });

    it("Delete theme from the storage", () => {
        //const shops = deleteTheme('test-shop.myshopify.com', 105572627888, testStorageData);
        expect({shops}).toMatchObject(mockupStorageWithDeletedTheme);
    });
    
});