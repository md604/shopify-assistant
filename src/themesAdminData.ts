import createApp from "@shopify/app-bridge";
import { getSessionToken } from "@shopify/app-bridge-utils";


function graphqlShopThemesMeta() {
    const jsonScriptElement = document.querySelector('script[data-serialized-id="app-bridge-config"]');
    if (jsonScriptElement && jsonScriptElement.textContent) {
        const bridgeConfig = JSON.parse(jsonScriptElement.textContent); 
        const shopHostname = window.location.hostname;
        const GQL_URL_THEME_SECONDARY_DATA = `https://${shopHostname}/admin/online-store/admin/api/unversioned/graphql?operation=ThemeIndexSecondaryData`;   
        try {
            const app = createApp(bridgeConfig);
            const unsubscribeFromErrors = app.error(data => {
                /*
                const {
                  type,    // the error type
                  action,  // the original action including its id
                  message, // additional hints on how to fix the error
                } = data;
              
                // Handle all errors here
              
                switch(type) {
                  case Error.Action.INVALID_PAYLOAD:
                  // Do something with the error
                  break;
                }
                */
                // Handle all actions here
                // console.log('Error data event: ', data);

                // Suppress all app bridge errors that show up in extension's logs
            });
            getSessionToken(app).then(token => {
                // console.log('Session token: ', token)
                if (token) {
                    const operationName = 'ThemeIndexSecondaryData';
                    const variables = {
                        'first':20,
                        'themeUpdatesEnabled':true
                    };
                    /*
                    const variables = {
                        'first':20,
                        'themeUpdatesEnabled':true,
                        'editedThemeUpdatesEnabled':false
                    }; 
                    const query = `query ThemeIndexSecondaryData($first: Int, $themeUpdatesEnabled: Boolean!, $editedThemeUpdatesEnabled: Boolean!) {
                        onlineStore {
                        themes(first: $first, roles: [UNPUBLISHED, DEMO, MAIN, MOBILE]) {
                            edges {
                            node {
                                ...ThemeInfo
                            ...GitHubVersionControlConfiguration
                            sharingAccessToken
                            updateAvailable @include(if: $themeUpdatesEnabled)
                            codeEdited @include(if: $editedThemeUpdatesEnabled)
                            metadata {
                                currentVersion @include(if: $themeUpdatesEnabled) {
                                    ...ThemeVersionMetadata
                                __typename
                                }
                                latestVersion @include(if: $themeUpdatesEnabled) {
                                    ...ThemeVersionMetadata
                                __typename
                                }
                                __typename
                            }
                            __typename
                            }
                            __typename
                        }
                        __typename
                        }
                        __typename
                    }
                    }
                    fragment ThemeInfo on OnlineStoreTheme {
                        id
                    name
                    role
                    prefix
                    processing
                    processingFailed
                    editedAt
                    createdAt
                    mobileScreenshot: screenshot(height: 600, width: 350)
                    laptopScreenshot: screenshot(height: 900, width: 1160)
                    mobileScreenshotRedesign: screenshot(height: 900, width: 350)
                    thumbnailScreenshot: screenshot(
                        height: 1080
                        width: 1350
                        resizeHeight: 144
                        resizeWidth: 180
                    )
                    previewUrl
                    previewable
                    editable
                    themeStoreId
                    themeStoreUrl
                    supportedFeatures
                    metadata {
                        author
                        version
                        name
                        supportUrl: supportUrlV2
                        supportEmail
                        __typename
                    }
                    publishSchedules {
                        id
                        publishAt
                        __typename
                    }
                    __typename
                    }
                    fragment GitHubVersionControlConfiguration on OnlineStoreTheme {
                        versionControlConfiguration {
                        id
                        githubOrg
                        githubRepositoryId
                        githubRepositoryName
                        private
                        githubBranchName
                        lastError
                        syncOneWay
                        __typename
                    }
                    __typename
                    }
                    fragment ThemeVersionMetadata on OnlineStoreThemeThemeVersion {
                        semanticVersion
                    themeStoreThemeVersionId
                    themeStoreUpdatedAt
                    updateState
                    __typename
                    }`;
                    */
                    // ThemeIndexSecondaryData($first: Int, $themeUpdatesEnabled: Boolean!, $editedThemeUpdatesEnabled: Boolean!)
                    const query = `query ThemeIndexSecondaryData($first: Int, $themeUpdatesEnabled: Boolean!) {
                        onlineStore {
                            themes(first: $first, roles: [UNPUBLISHED, DEMO, MAIN, MOBILE]) {
                                edges {
                                    node {
                                        ...ThemeInfo
                                        ...GitHubVersionControlConfiguration
                                        sharingAccessToken
                                        metadata {
                                            currentVersion @include(if: $themeUpdatesEnabled) {
                                                ...ThemeVersionMetadata
                                                __typename
                                            }
                                            latestVersion @include(if: $themeUpdatesEnabled) {
                                                ...ThemeVersionMetadata
                                                __typename
                                            }
                                            __typename
                                        }
                                        __typename
                                    }
                                    __typename
                                }
                                __typename
                            }
                            __typename
                        }
                    }
                    fragment ThemeInfo on OnlineStoreTheme {
                        id
                        name
                        role
                        processing
                        processingFailed
                        editedAt
                        createdAt
                        themeStoreId
                        themeStoreUrl
                        metadata {
                            author
                            version
                            name
                            supportUrl: supportUrlV2
                            supportEmail
                            __typename
                        }
                        __typename
                    }
                    fragment GitHubVersionControlConfiguration on OnlineStoreTheme {
                        versionControlConfiguration {
                            id
                            githubOrg
                            githubRepositoryId
                            githubRepositoryName
                            private
                            githubBranchName
                            lastError
                            syncOneWay
                            __typename
                        }
                        __typename
                    }
                    fragment ThemeVersionMetadata on OnlineStoreThemeThemeVersion {
                        semanticVersion
                        themeStoreThemeVersionId
                        themeStoreUpdatedAt
                        updateState
                        __typename
                    }`;
                
                    fetch(GQL_URL_THEME_SECONDARY_DATA, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            operationName,
                            query,
                            variables,
                        })
                    })
                    .then(r => r.json())
                    .then(data => {
                        console.log('GraphQl data returned:', data);
                        chrome.runtime.sendMessage(
                            {
                                type: 'gitThemes',
                                domainName: window.location.hostname,
                                data,
                                to: 'sw'
                            }
                        );
                    });
                }
                
            });
        } catch (error) {
            console.log('An error occured. Oops.');
            return false;
        }
    }
}

graphqlShopThemesMeta();

export default {};