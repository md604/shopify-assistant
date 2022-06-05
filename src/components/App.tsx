import React, {useState, useCallback, useEffect} from 'react';
import {
  Layout,
  FooterHelp,
  Card,
  Link,
  Tabs,
  Badge
} from '@shopify/polaris';
import { Themes } from './Themes';
import { PopupContext, initAppConfig } from './PopupContext';
import { getLocalThemes, storageDeleteThemeData } from '../utils/storage';
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
  
  const updateTheme = (newTheme:ShopifyTheme) => {
    const updatedThemes:ShopifyTheme[] = themes.map(theme => {
      if (theme.id == newTheme.id) return newTheme; 
      return theme;
    });
    setThemes(updatedThemes);
    // sync local changes with the store
    // update theme in a search index
    searchWorker.postMessage({   
      type: 'updateThemeSearchIndex',
      theme: newTheme,
      to: 'searchWorker'
    });
  }
  
  const deleteTheme = (deletedTheme:ShopifyTheme) => {
    const updatedThemes:ShopifyTheme[] = themes.filter(theme => theme.id != deletedTheme.id);
    // save localy
    setThemes(updatedThemes);
    // sync local changes with the store
    // update theme in a search index
    searchWorker.postMessage({   
      type: 'deleteThemeSearchIndex',
      theme: deletedTheme,
      to: 'searchWorker'
    });
    // remove from the store
    storageDeleteThemeData(deletedTheme);
  }

  const updateThemes = (newThemes:ShopifyTheme[]) => {
    setThemes([...newThemes]);
  }
  const resetThemes = async () => {
    const newThemes:ShopifyTheme[] = await getLocalThemes();
    setThemes([...newThemes]);
  }
  const [config, setConfig] = useState<AppConfig>(initAppConfig);
  const updateConfig = (newConfig:Partial<AppConfig>) => {
    setConfig({...config, ...newConfig});
  }

  const [themeCounter, setThemeCounter] = useState<number>(0);
  const updateThemeCounter = (newCounterValue:number) => {
    setThemeCounter(newCounterValue);
  }
  
  // update context after mount
  useEffect(() => {
    searchWorker.addEventListener('message', async function(e) {
      const message = e.data;
      if (message.type) {
          switch (message.type) {
              case 'searchResults':
                  // console.log('Search results: ', message.results);
                  if (message.results && message.results.length > 0) setThemes(message.results);
              break;
              case 'enableSearchBar':
                  // console.log('New search state: ', message.value);
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
  },[selected]);

  const tabs = [
    {
      id: 'themes-tab-1',
      //content: 'All themes'
      content: (
        <span>
          Themes {selected === 0 && <Badge status="new">{String(themeCounter)}</Badge>}
        </span>
      ),
      panelID: 'themes-tab-content-1',
    },
    {
      id: 'themes-tab-2',
      //content: 'Pinned',
      content: (
        <span>
          Pinned {selected === 1 && <Badge status="new">{String(themeCounter)}</Badge>}
        </span>
      ),
      panelID: 'themes-tab-content-2',
    },
    {
      id: 'themes-tab-3',
      //content: 'Gone',
      content: (
        <span>
          Gone {selected === 2 && <Badge status="new">{String(themeCounter)}</Badge>}
        </span>
      ),
      panelID: 'themes-tab-content-3',
    }
  ];

  return (
    <PopupContext.Provider value={{ 
      config, 
      themes, 
      updateTheme, 
      deleteTheme, 
      updateThemes, 
      resetThemes, 
      getSearchWorker,
      updateThemeCounter 
    }}>
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