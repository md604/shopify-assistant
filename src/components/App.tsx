import React, {useState, useCallback} from 'react';
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  Button,
  FormLayout,
  TextField,
  AccountConnection,
  ChoiceList,
  SettingToggle,
  Tabs,
} from '@shopify/polaris';
import {ImportMinor} from '@shopify/polaris-icons';

export function App() {
  const [filterQuery, setFilterQuery] = useState('');

  const handleFilterQueryChange = useCallback((value) => setFilterQuery(value), []);
  
  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: 'all-customers-1',
      content: 'All',
      accessibilityLabel: 'All customers',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'accepts-marketing-1',
      content: 'Accepts marketing',
      panelID: 'accepts-marketing-content-1',
    },
    {
      id: 'repeat-customers-1',
      content: 'Repeat customers',
      panelID: 'repeat-customers-content-1',
    },
    {
      id: 'prospects-1',
      content: 'Prospects',
      panelID: 'prospects-content-1',
    },
  ];
/*
  const breadcrumbs = [
    {content: 'Sample apps', url: '/sample-apps'},
    {content: 'Create React App', url: '/create-react-app'},
  ];
  const primaryAction = {content: 'New product'};
  const secondaryActions = [{content: 'Import', icon: ImportMinor}];
*/

  return (
    /*
    <Page
      title="Polaris"
      breadcrumbs={breadcrumbs}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}
    >
    */
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
              <Card.Section title={tabs[selected].content}>
                <p>Tab {selected} selected</p>
              </Card.Section>
            </Tabs>
            <FormLayout>
              <FormLayout.Group>
                <TextField
                  value={filterQuery}
                  label="Filter themes"
                  placeholder="Use theme's names or tags..."
                  onChange={handleFilterQueryChange}
                  autoComplete="given-name"
                />
              </FormLayout.Group>
            </FormLayout>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <FooterHelp>
            For more details visit our{' '}
            <Link url="https://github.com/md604/shopify-assistant">GitHub</Link>.
          </FooterHelp>
        </Layout.Section>
      </Layout>
    /*
    </Page>
    */
  );
}