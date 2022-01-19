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

export function App() {
  const [selected, setSelected] = useState(0);
  const handleTabChange = useCallback((selectedTabIndex) => setSelected(selectedTabIndex),[]);

  const tabs = [
    {
      id: 'themes-tab-1',
      content: 'Themes',
      panelID: 'themes-tab-content-1',
    }
  ];

  return (
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
  );
}