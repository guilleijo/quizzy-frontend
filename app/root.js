import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import App from './app';
import buildStore from './redux/store';
import setupConfig from './config';
import jQuery from 'jquery';
global.jquery = jQuery;
global.$ = jQuery;
import easing from 'jquery.easing';

setupConfig();
const store = buildStore();

ReactDom.render(
  <Provider store={ store } >
    <App/>
  </Provider>,
  document.getElementById('app')
);
