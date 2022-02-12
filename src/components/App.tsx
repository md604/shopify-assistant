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
import { PopupContext } from './PopupContext';
import { getLocalThemes } from '../utils/storage';
import { ShopifyTheme } from '../utils/interfaces';

export function App() {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[]);

  //context methods and hooks
  const [themes, setThemes] = useState<ShopifyTheme[]>([]);
  const updateThemes = (newThemes:ShopifyTheme[]) => {
    setThemes(newThemes);
  }
  
  // update context after mount
  useEffect(() => {
    ( async () => setThemes(await getLocalThemes()) )(); 
    chrome.runtime.sendMessage(
      {
        type: 'createSearchIndex'
      }
    );
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

  chrome.runtime.onMessage.addListener(
    async function(message, sender, sendResponse) {
      if (message.type) {
          switch (message.type) {
              case 'searchResults':
                  console.log('Search results: ', message.results);
                  //setThemes(message.results);
              break;
              default: console.log('(Popup listener) Unknown message type');
          }
      } else {
          console.log('(Popup listener) Message type is not present');
      }
    }
  );

  return (
    <PopupContext.Provider value={{ themes, updateThemes }}>
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