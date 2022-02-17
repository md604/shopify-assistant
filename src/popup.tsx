import React from 'react';
import ReactDOM from 'react-dom';
import {AppProvider} from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import '@shopify/polaris/dist/styles.css';
import './styles/popup.scss';

import { App } from './components/App';

// init search worker
const searchWorker = new Worker(
  chrome.runtime.getURL('searchWorker.js'), 
  {
    type: 'module'
  }
);

function getWorker():Worker {
  return searchWorker;
}

/*
searchWorker.addEventListener('message', e => {
  console.log(e.data);
});
searchWorker.postMessage('hello');
*/

ReactDOM.render(
  <AppProvider i18n={enTranslations}>
    <App getSearchWorker={getWorker} />
  </AppProvider>,
  document.getElementById('root'),
);