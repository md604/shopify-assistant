import React, {useState, useCallback} from 'react';
import {
  Layout,
  FooterHelp,
  Card,
  Link,
  Tabs,
} from '@shopify/polaris';
import {ImportMinor} from '@shopify/polaris-icons';
import { Themes } from './Themes';
import { PopupContext, ShopifyTheme } from './PopupContext';

export function App() {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[]);

  //context methods and hooks
  const [themes, setThemes] = useState<ShopifyTheme[]>([]);
  const updateThemes = (newThemes:ShopifyTheme[]) => {
    setThemes(newThemes);
  }

  const tabs = [
    {
      id: 'themes-tab-1',
      content: 'Themes',
      panelID: 'themes-tab-content-1',
    }
  ];

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