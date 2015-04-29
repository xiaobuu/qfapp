'use strict';

import Dispatcher from '../core/Dispatcher';
import PayloadSources from '../constants/PayloadSources';
import EventEmitter from 'eventemitter3';
import assign from 'react/lib/Object.assign';

import PageAPIUtils from '../utils/PageAPIUtils';
import PageConstants from '../constants/PageConstants';
import Immutable from 'immutable';
import AppConstants from '../constants/AppConstants';
import router from '../router';

const CHANGE_EVENT = 'CHANGE_PageStore';

let _items = Immutable.Map();
let _keyWord = '';
let _page = 1;
let _typeId = '000000';
let _failMsg ='';

function trans(){
  let keyWOrd = _keyWord;
  if(keyWOrd){
    router.transitionTo('shop',null,{
      keyWord: _keyWord,
      typeId: _typeId,
      page: _page
    });
  }else{
    router.transitionTo('shop',null,{
      typeId: _typeId,
      page: _page
    });
  }

}

function cleanCache(key, second = 60){
  setTimeout(()=>{_items = _items.delete(key); }, 1000 * second);//cache for 60 min
}
function refresh(){
  let item = _items.get(PageAPIUtils.Id(_keyWord, _typeId, _page));
  if (!item || item === PageConstants.PAGE_KEY_FAILURE) {
    //设置无内容标志
    _items = _items.set(PageAPIUtils.Id(_keyWord, _typeId, _page), PageConstants.PAGE_KEY_NULL);
    //开始异步获取数据
    PageAPIUtils.getItems(_keyWord, _typeId, _page);
  }
}

const PageStore = assign({}, EventEmitter.prototype, {

  getFailMsg(){
    return _failMsg;
  },

  getItems() {
    let item = _items.get(PageAPIUtils.Id(_keyWord, _typeId, _page));
    console.log('getItems', item);
    if (!item || item === PageConstants.PAGE_KEY_NULL) {
      //设置无内容标志
      _items = _items.set(PageAPIUtils.Id(_keyWord, _typeId, _page), PageConstants.PAGE_KEY_NULL);
      //开始异步获取数据
      PageAPIUtils.getItems(_keyWord, _typeId, _page);
      return PageConstants.PAGE_KEY_NULL;
    }
    else{
      return item;
    }
  },


  getHome() {
    let item = _items.get(PageConstants.PAGE_KEY_HOME);
    console.log('get home', item);
    if (!item || item === PageConstants.PAGE_KEY_NULL) {
      //设置无内容标志
      _items = _items.set(PageConstants.PAGE_KEY_HOME, PageConstants.PAGE_KEY_NULL);
      //开始异步获取数据
      PageAPIUtils.getHome();
      return PageConstants.PAGE_KEY_NULL;
      //清除内容
    }
    else{
      return item;
    }
  },
  emitChange() {
    return this.emit(CHANGE_EVENT);
  },

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener(callback) {
    this.off(CHANGE_EVENT, callback);
  }

});

PageStore.dispatcherToken = Dispatcher.register((payload) => {
  var action = payload.action;
  if(payload.source==='SERVER_ACTION')
  {
    switch (action.actionType) {
      case PageConstants.PAGE_SUCCESS:
        console.log('page success',action.data);
        if(action.data.isHome){
          //HOME
          _items = _items.set(action.data.key, action.data.body);
          cleanCache(action.data.key);
        }
        else{//搜索页
          if(action.data.body.Code===0){
            let items = action.data.body.Info;

            items.forEach(data=> {
              data.goods_id = parseInt(data.goods_id);
              data.quality = parseInt(data.quality);
              data.price = parseFloat(data.price);
              data.status = parseInt(data.status);
              data.t_limit = parseInt(data.t_limit);
              data.user_id = parseInt(data.user_id);
            });


            _items = _items.set(action.data.key, items);
            cleanCache(action.data.key);
          }
          else{
            _failMsg = action.data.body.Msg;
          }
        }

        PageStore.emitChange();
        break;
      case PageConstants.PAGE_FAILURE:
        console.log('page failure',action.data);
        _items = _items.set(action.data.key, PageConstants.PAGE_KEY_FAILURE);
        _failMsg = '网络错误';
        PageStore.emitChange();
        break;
      default:
      // Do nothing

    }
  }
  else{
    switch (action.actionType) {


      case PageConstants.PAGE_CHANGE_PAGE:
        _page = action.page;
        trans();
        //PageStore.emitChange();
        break;
      case PageConstants.PAGE_NEW_KEY_WORD:
        _keyWord = action.keyword || '';
        //_typeId = '000000';
        _page = 1;
        trans();
        //PageStore.emitChange();
        break;
      case PageConstants.PAGE_CHANGE_TYPE:
        _typeId = action.type_id || '000000';
        _page = 1;
        trans();
        //PageStore.emitChange();
        break;
      case PageConstants.PAGE_REFRESH:
        refresh();
        PageStore.emitChange();
        break;
      case AppConstants.TRANSITION:
        if(action.data.path&&action.data.pathname===('/shop')>=0)
        {
          console.log('go query!!!');
          const query = action.data.query;
          _page = query.page || 1;
          _keyWord = query.keyWord || '';
          _typeId = query.typeId || '000000';
        }
        PageStore.emitChange();
        break;
      default:
         //
    }

  }
});

export default PageStore;
