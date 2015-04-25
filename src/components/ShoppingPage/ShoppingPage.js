'use strict';

import React from 'react';
import Banner from '../Banner';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';

import PageStore from '../../stores/PageStore';
import BookCard from '../BookCard';

import PageConstants from '../../constants/PageConstants';
require('./ShoppingPage.scss');


const ShoppingPage = React.createClass({
  mixins: [PureRenderMixin],

  _onPageChange(){
    this.setState({
      items: PageStore.getItems('all')
    });
  },

  getInitialState(){
    return {
      items: PageStore.getItems('all')
    };
  },


  componentWillMount(){
    PageStore.addChangeListener(this._onPageChange);

  },
  componentWillUnMount(){
    PageStore.removeChangeListener(this._onPageChange);
  },

  render() {
    const items = this.state.items;
    let elem;
    if(items===PageConstants.PAGE_KEY_NULL){
      elem = <img src="./facebook.svg" />;
    }
    else
    {
      elem = items.map(data => <BookCard item={data}/>);
    }
    console.log(items);
    return (
      <div className="shoppingPage">
        <div className="inner">
          <div className="nav">
            <h3>类别</h3>
            <p>所有</p>

          </div>
          <div className="main">
            <div className="items">
              {elem}
            </div>
          </div>
        </div>

      </div>
    );
  }
});

export default ShoppingPage;
