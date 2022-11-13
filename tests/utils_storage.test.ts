
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
    mockupStorageNewThemeMeta,
    mockupUpdataedStorageWithNewThemeMeta,
    mockupStorageWithDeletedTheme
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
    
    it("Update meta data of a selected theme", () => {
        // 2bd: convert to themes array
        const shops = getUpdatedStorageShopsWithNewThemesMeta('test-shop.myshopify.com', 105572627888, mockupStorageNewThemeMeta, testStorageData);
        expect({shops}).toMatchObject(mockupUpdataedStorageWithNewThemeMeta);
    });

    it("Delete theme from the storage", () => {
        const shops = deleteTheme('test-shop.myshopify.com', 105572627888, testStorageData);
        expect({shops}).toMatchObject(mockupStorageWithDeletedTheme);
    });
    
});