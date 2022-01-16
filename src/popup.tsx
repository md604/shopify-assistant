import React from 'react';
import ReactDOM from 'react-dom';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';
import './styles/popup.scss';

import { App } from './components/App';
/*
function WrappedApp() {
  return (
    <AppProvider i18n={enTranslations}>
      <App />
    </AppProvider>
  );
}
*/
//ReactDOM.render(<WrappedApp />, document.getElementById('root'));
ReactDOM.render(
  <AppProvider i18n={enTranslations}>
    <App />
  </AppProvider>,
  document.getElementById('root'),
);