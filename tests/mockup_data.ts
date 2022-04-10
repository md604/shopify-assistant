import { 
    ShopifyTheme, 
    StorageThemesData,
    ThemeMeta,
    defaultThemeMeta 
} from '../src/utils/interfaces';

// storage data

export const mockupStorage: any = {
    "shops": {
        "test-shop.myshopify.com": {
            "themes": {
                "105572627888": {
                    "admin_graphql_api_id": "gid://shopify/Theme/105572627888",
                    "created_at": "2020-08-04T05:53:51-04:00",
                    "id": 105572627888,
                    "name": "Debut",
                    "previewable": true,
                    "processing": false,
                    "role": "main",
                    "theme_store_id": 777,
                    "updated_at": "2020-08-16T08:46:23-04:00"
                },
                "127641171777": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127641171777",
                    "created_at": "2022-03-12T13:55:36-05:00",
                    "id": 127641171777,
                    "name": "Search feature - Test [gitHub]",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 777,
                    "updated_at": "2022-03-12T13:57:08-05:00"
                }
            },
            "themesMeta": {
                "105572627888": {
                    "available": true
                },
                "127641171777": {
                    "available": true,
                    "pinned": true,
                    "tags": [
                        "starcraft",
                        "test"
                    ]
                }
            }
        }
    }
};

export const mockupStorageNewThemes: StorageThemesData = {
    "domainName": "test-shop.myshopify.com",
    "themes": [
        {
            "id":105572627888,
            "name":"Debut",
            "created_at":"2020-08-04T05:53:51-04:00",
            "updated_at":"2020-08-16T08:46:23-04:00",
            "role":"main",
            "theme_store_id":777,
            "previewable":true,
            "processing":false,
            "admin_graphql_api_id":"gid:\/\/shopify\/Theme\/105572627888"
        },
        {
            "id":127642534000,
            "name":"Theme 56 test",
            "created_at":"2022-03-12T14:07:15-05:00",
            "updated_at":"2022-03-12T14:07:46-05:00",
            "role":"unpublished",
            "theme_store_id":777,
            "previewable":true,
            "processing":false,
            "admin_graphql_api_id":"gid:\/\/shopify\/Theme\/127642534000"
        }
    ]
};

export const mockupUpdatedStorage: any = {
    "shops": {
        "test-shop.myshopify.com": {
            "themes": {
                "105572627888": {
                    "admin_graphql_api_id": "gid://shopify/Theme/105572627888",
                    "created_at": "2020-08-04T05:53:51-04:00",
                    "id": 105572627888,
                    "name": "Debut",
                    "previewable": true,
                    "processing": false,
                    "role": "main",
                    "theme_store_id": 777,
                    "updated_at": "2020-08-16T08:46:23-04:00"
                },
                "127641171777": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127641171777",
                    "created_at": "2022-03-12T13:55:36-05:00",
                    "id": 127641171777,
                    "name": "Search feature - Test [gitHub]",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 777,
                    "updated_at": "2022-03-12T13:57:08-05:00"
                },
                "127642534000": {
                    "id":127642534000,
                    "name":"Theme 56 test",
                    "created_at":"2022-03-12T14:07:15-05:00",
                    "updated_at":"2022-03-12T14:07:46-05:00",
                    "role":"unpublished",
                    "theme_store_id":777,
                    "previewable":true,
                    "processing":false,
                    "admin_graphql_api_id":"gid:\/\/shopify\/Theme\/127642534000"
                }
            },
            "themesMeta": {
                "105572627888": {
                    "available": true
                },
                "127641171777": {
                    "available": false,
                    "pinned": true,
                    "tags": [
                        "starcraft",
                        "test"
                    ]
                },
                "127642534000": {
                    "available": true
                }
            }
        }
    }
};

export const mockupCompleteStorage: any = {
    "shops": {
        "vue-js-example.myshopify.com": {
            "themes": {
                "106772627612": {
                    "admin_graphql_api_id": "gid://shopify/Theme/106772627612",
                    "created_at": "2020-08-04T05:53:51-04:00",
                    "id": 106772627612,
                    "name": "Debut",
                    "previewable": true,
                    "processing": false,
                    "role": "main",
                    "theme_store_id": 796,
                    "updated_at": "2020-08-16T08:46:23-04:00"
                },
                "127416303772": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127416303772",
                    "created_at": "2022-01-29T13:46:45-05:00",
                    "id": 127416303772,
                    "name": "New prod theme",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 887,
                    "updated_at": "2022-01-29T13:48:25-05:00"
                },
                "127642271900": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127642271900",
                    "created_at": "2022-03-12T13:55:36-05:00",
                    "id": 127642271900,
                    "name": "Search feature - Test [gitHub]",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-12T13:57:08-05:00"
                },
                "127642304668": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127642304668",
                    "created_at": "2022-03-12T13:57:56-05:00",
                    "id": 127642304668,
                    "name": "Fix dropdown menu",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-12T13:58:42-05:00"
                },
                "127642468508": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127642468508",
                    "created_at": "2022-03-12T14:05:43-05:00",
                    "id": 127642468508,
                    "name": "Prod theme backup 4",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-12T14:06:13-05:00"
                },
                "127642534044": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127642534044",
                    "created_at": "2022-03-12T14:07:15-05:00",
                    "id": 127642534044,
                    "name": "Prod theme backup 6",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-12T14:07:46-05:00"
                },
                "127644074140": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644074140",
                    "created_at": "2022-03-13T06:46:01-04:00",
                    "id": 127644074140,
                    "name": "Prod theme backup 7",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:46:40-04:00"
                },
                "127644139676": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644139676",
                    "created_at": "2022-03-13T06:47:18-04:00",
                    "id": 127644139676,
                    "name": "Prod theme backup 9",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:47:36-04:00"
                },
                "127644205212": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644205212",
                    "created_at": "2022-03-13T06:48:16-04:00",
                    "id": 127644205212,
                    "name": "Prod theme backup 11",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:48:39-04:00"
                },
                "127644237980": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644237980",
                    "created_at": "2022-03-13T06:48:46-04:00",
                    "id": 127644237980,
                    "name": "Prod theme backup 12",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:49:08-04:00"
                },
                "127644270748": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644270748",
                    "created_at": "2022-03-13T06:49:14-04:00",
                    "id": 127644270748,
                    "name": "Prod theme backup 13",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:49:33-04:00"
                },
                "127644303516": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644303516",
                    "created_at": "2022-03-13T06:49:37-04:00",
                    "id": 127644303516,
                    "name": "Prod theme backup 14",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:49:57-04:00"
                },
                "127644336284": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127644336284",
                    "created_at": "2022-03-13T06:50:07-04:00",
                    "id": 127644336284,
                    "name": "Prod theme backup 15",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 796,
                    "updated_at": "2022-03-13T06:50:26-04:00"
                }
            },
            "themesMeta": {
                "106772627612": {
                    "available": true
                },
                "127416303772": {
                    "available": true
                },
                "127642271900": {
                    "available": true,
                    "pinned": true,
                    "tags": [
                        "starcraft",
                        "test"
                    ]
                },
                "127642304668": {
                    "available": true,
                    "pinned": true,
                    "tags": []
                },
                "127642468508": {
                    "available": true,
                    "pinned": true,
                    "tags": []
                },
                "127642534044": {
                    "available": true
                },
                "127644074140": {
                    "available": true
                },
                "127644139676": {
                    "available": true
                },
                "127644205212": {
                    "available": true
                },
                "127644237980": {
                    "available": true
                },
                "127644270748": {
                    "available": true
                },
                "127644303516": {
                    "available": true
                },
                "127644336284": {
                    "available": true,
                    "pinned": false,
                    "tags": []
                }
            }
        }
    }
};

export const mockupStorageNewThemeMeta: ThemeMeta = {
    pinned: true,
    available: true,
    tags: ['galaxy']
};

export const mockupUpdataedStorageWithNewThemeMeta: any = {
    "shops": {
        "test-shop.myshopify.com": {
            "themes": {
                "105572627888": {
                    "admin_graphql_api_id": "gid://shopify/Theme/105572627888",
                    "created_at": "2020-08-04T05:53:51-04:00",
                    "id": 105572627888,
                    "name": "Debut",
                    "previewable": true,
                    "processing": false,
                    "role": "main",
                    "theme_store_id": 777,
                    "updated_at": "2020-08-16T08:46:23-04:00"
                },
                "127641171777": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127641171777",
                    "created_at": "2022-03-12T13:55:36-05:00",
                    "id": 127641171777,
                    "name": "Search feature - Test [gitHub]",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 777,
                    "updated_at": "2022-03-12T13:57:08-05:00"
                }
            },
            "themesMeta": {
                "105572627888": {
                    "pinned": true,
                    "available": true,
                    "tags": ['galaxy']
                },
                "127641171777": {
                    "available": true,
                    "pinned": true,
                    "tags": [
                        "starcraft",
                        "test"
                    ]
                }
            }
        }
    }
};

export const mockupStorageWithDeletedTheme: any = {
    "shops": {
        "test-shop.myshopify.com": {
            "themes": {
                "127641171777": {
                    "admin_graphql_api_id": "gid://shopify/Theme/127641171777",
                    "created_at": "2022-03-12T13:55:36-05:00",
                    "id": 127641171777,
                    "name": "Search feature - Test [gitHub]",
                    "previewable": true,
                    "processing": false,
                    "role": "unpublished",
                    "theme_store_id": 777,
                    "updated_at": "2022-03-12T13:57:08-05:00"
                }
            },
            "themesMeta": {
                "127641171777": {
                    "available": true,
                    "pinned": true,
                    "tags": [
                        "starcraft",
                        "test"
                    ]
                }
            }
        }
    }
};

// mockup results

export const mockupShopifyThemes: ShopifyTheme[] = [
    {
        "name": "Debut",
        "domainName": "test-shop.myshopify.com",
        "lastUpdate": 1597581983000,
        "published": true,
        "developer": false,
        "id": 105572627888,
        "pinned": false,
        "available": true,
        "tags": []
    },
    {
        "name": "Search feature - Test [gitHub]",
        "domainName": "test-shop.myshopify.com",
        "lastUpdate": 1647111428000,
        "published": false,
        "developer": false,
        "id": 127641171777,
        "pinned": true,
        "available": true,
        "tags": [
            "starcraft",
            "test"
        ]
    }
];