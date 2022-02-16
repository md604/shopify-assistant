import React, {useState, useCallback, useEffect} from 'react';
import {
  Layout,
  FooterHelp,
  Card,
  Link,
  Tabs,
} from '@shopify/polaris';
import {ImportMinor} from '@shopify/polaris-icons';
import { Themes } from './Themes';
import { PopupContext, initAppConfig } from './PopupContext';
import { getLocalThemes } from '../utils/storage';
import { ShopifyTheme, AppConfig } from '../utils/interfaces';


type Props = {
  //state: string;
  //setState: (val: string) => void;
  getSearchWorker: () => Worker;
  //placeholder: string;
};

export function App({getSearchWorker}: Props) {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[]);

  //context methods and hooks
  const [themes, setThemes] = useState<ShopifyTheme[]>([]);
  const updateThemes = (newThemes:ShopifyTheme[]) => {
    setThemes(newThemes);
  }
  const resetThemes = async () => {
    const newThemes:ShopifyTheme[] = await getLocalThemes();
    setThemes(newThemes);
  }
  const [config, setConfig] = useState<AppConfig>(initAppConfig);
  const updateConfig = (newConfig:Partial<AppConfig>) => {
    setConfig({...config, ...newConfig});
  }
  
  // update context after mount
  useEffect(() => {
    ( async () => setThemes(await getLocalThemes()) )();
    // request to refresh a search index when open popup 
    chrome.runtime.sendMessage(
      {
        type: 'createSearchIndex',
        to: 'sw'
      }
    );
    chrome.runtime.onMessage.addListener(
      async function(message, sender, sendResponse) {
        if (message.to == 'popup' && message.type) {
            switch (message.type) {
                case 'searchResults':
                    console.log('Search results: ', message.results);
                    if (message.results && message.results.length > 0) setThemes(message.results);
                break;
                case 'updateSearchState':
                    console.log('New search state: ', message.value);
                    updateConfig({ enableSearchBar: message.value });
                break;
                default: console.log('(Popup listener) Unknown message type');
            }
        } else {
            console.log('(Popup listener) Wrong recepient or message type is not present');
        }
      }
    );
    console.log('Console log once');
  },[]);
  
  const tabs = [
    {
      id: 'themes-tab-1',
      content: 'All themes',
      panelID: 'themes-tab-content-1',
    },
    {
      id: 'themes-tab-2',
      content: 'Pinned themes',
      panelID: 'themes-tab-content-2',
    }
  ];

  return (
    <PopupContext.Provider value={{ config, themes, updateThemes, resetThemes }}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Themes/>
            </Tabs>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <FooterHelp>
            For more details visit our{' '}
            <Link url="https://github.com/md604/shopify-assistant">GitHub</Link>.
          </FooterHelp>
        </Layout.Section>
      </Layout>
    </PopupContext.Provider>
  );
}