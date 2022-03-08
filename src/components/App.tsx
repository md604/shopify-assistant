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
  getSearchWorker: () => Worker;
};

export function App({getSearchWorker}: Props) {
  const [searchWorker, setSearchWorker] = useState(getSearchWorker());

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
    searchWorker.addEventListener('message', async function(e) {
      const message = e.data;
      if (message.type) {
          switch (message.type) {
              case 'searchResults':
                  console.log('Search results: ', message.results);
                  if (message.results && message.results.length > 0) setThemes(message.results);
              break;
              case 'enableSearchBar':
                  console.log('New search state: ', message.value);
                  updateConfig({ enableSearchBar: message.value });
              break;
              default: console.log('(Popup listener) Unknown message type');
          }
      } else {
          console.log('(Popup listener) Wrong recepient or message type is not present');
      }
    });

    ( async () => {
      const themes = await getLocalThemes();
      // init popup themes
      setThemes(themes);
      // add themes to the search index
      searchWorker.postMessage({   
        type: 'createSearchIndex',
        themes,
        to: 'searchWorker'
      });
    } )();

  },[]);

  useEffect(()=> {
    let tabFilter: Partial<ShopifyTheme> = {};
    switch (tabs[selected].id) {
      case 'themes-tab-2':
        tabFilter = { pinned: true }; 
      break;
      case 'themes-tab-3':
        tabFilter = { available: false }; 
      break;
    }
    updateConfig({ tabFilterThemeProperty: tabFilter });
    console.log('Select tab');
  },[selected]);

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
    },
    {
      id: 'themes-tab-3',
      content: 'Gone',
      panelID: 'themes-tab-content-3',
    }
  ];

  return (
    <PopupContext.Provider value={{ config, themes, updateThemes, resetThemes, getSearchWorker }}>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Themes key={tabs[selected].id}/>
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