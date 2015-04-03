'use strict';
/*
  使用react-router定义路径
  (react-router以后的api可能会大变
 */

import React from 'react';
import { Route, DefaultRoute } from 'react-router';
import App from './components/App';
import HomePage from './components/HomePage';
import ShoppingPage from './components/ShoppingPage'

export default (
  <Route name="app" path='/' handler={App}>
    <Route name='shop' handler={ShoppingPage} />
    <Route name='sell' handler={HomePage} />
    <Route name='orders' handler={HomePage} />
    <Route name='test' handler={HomePage} />
    <DefaultRoute name="home" handler={HomePage}/>
  </Route>
);
