'use strict';

import React from 'react';
import OrderStore from '../../stores/OrderStore'
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import OrderConstants from '../../constants/OrderConstants';
import OrderItem from '../OrderItem';
import SellOrderItem from '../SellOrderItem';
import BuyOrderItem from '../BuyOrderItem';
import OrderActions from '../../actions/OrderActions';
import Counter from '../Counter';
import Modal from '../Modal';
import ButtonNormal from '../ButtonNormal';
import {paperplane} from '../SVGs';
require('./Orders.scss');

const SellOrders = React.createClass({
  mixins: [PureRenderMixin],
  _onOrderChange(){
    let key = OrderStore.getKey();
    this.setState({
      key,
      items: OrderStore.getItems(),
      currentPage: OrderStore.getPage(),
      isSubmitting: OrderStore.getIsSubmitting(),
      isSuccessful: OrderStore.getSuccess(),
      realErrMsg: OrderStore.getSubmitMsg()
    });
  },

  getInitialState(){
    let key = OrderStore.getKey();
    return {
      key,
      items: OrderStore.getItems(key),
      modalCancelIsOpen: false,
      applyReason: '',
      isSubmitting: OrderStore.getIsSubmitting(),
      isSuccessful: OrderStore.getSuccess(),
      realErrMsg: OrderStore.getSubmitMsg(),
      isNormalOrder: false
    };
  },
  componentWillMount(){
    OrderStore.addChangeListener(this._onOrderChange);

  },
  componentWillUnmount(){
    OrderStore.removeChangeListener(this._onOrderChange);
  },
  handleRetry(){
    OrderActions.retry(this.state.key);
  },
  handlePageChange(page){
    OrderActions.changePage(page);
  },
  handleApplyCancel(id){
    OrderActions.newSubmit();
    this.setState({
      cancelBook: id,
      modalCancelIsOpen: true,
      isNormalOrder: false
    })
  },
  handleApplyCancelNormal(id){
    OrderActions.newSubmit();
    this.setState({
      cancelBook: id,
      modalCancelIsOpen: true,
      isNormalOrder: true
    })
  },
  handleCloseModal(){
    this.setState({
      modalCancelIsOpen: false
    })
  },
  handleApplyReasonChange(e){
    this.setState({
      applyReason: e.target.value
    })
  },
  handleRealSubmitClick(){
    if(this.state.isSuccessful){
      this.setState({
        modalCancelIsOpen: false
      });
      return;
    }
    if(this.state.isNormalOrder){
      OrderActions.cancelOrderNormalSubmit(this.state.cancelBook);
    }
    else {
      if (!this.state.isSubmitting) {
        if (this.state.applyReason.length < 6) {
          this.setState({realErrMsg: '理由最少6个字额'});
        }
        else {
          OrderActions.cancelOrderSubmit(this.state.cancelBook, this.state.applyReason);
        }
      }
    }
  },
  render(){
    let elem, max, pagination;
    const items = this.state.items;
    if(items===OrderConstants.ORDER_KEY_NULL){
      elem = <img src="./facebook.svg" />;
    }
    else if(items===OrderConstants.PAGE_KEY_FAILURE){
      elem = <div className="failure">
        <p>啊哦，加载失败了</p>
        <p>{this.state.failMsg}</p>
        <ButtonNormal text="重试" onClick={this.handleRetry}/>
      </div>;
    }
    else{
      pagination = <div className="pagination">
        <Counter initValue={this.state.currentPage} OnValueChange={this.handlePageChange} max={max} min={1}/>
      </div>;
      if(items && items.length<10){
        max = this.state.currentPage;
      }
      else{
        max = 1;
      }
      switch (this.state.key){
        case OrderConstants.ORDER_KEY:
          if(items.length){
            elem = items.map( order => <BuyOrderItem key={order.book_id} data={order} cancelClick={this.handleApplyCancelNormal}/>);
          }
          else{
            elem = <div className="failure"><p>没有订单 ʅ(‾◡◝)ʃ</p></div>
          }
          break;
        case OrderConstants.ON_SALE_ORDER_KEY:
          if(items.length){
            elem = items.map((order)=>
                <SellOrderItem key={order.goods_id} data={order}/>
            );
          }
          else{
            elem = <div className="failure"><p>没有在售物品 (＠゜▽゜@)ノ</p></div>
          }
          break;
        case OrderConstants.OFF_SALE_ORDER_KEY:
          if(items.length){
            elem = items.map((order)=>
                <SellOrderItem key={order.goods_id} data={order}/>
            );
          }
          else{
            elem = <div className="failure"><p>没有历史物品ヾ(○゜▽゜○)</p></div>
          }
          break;
        case OrderConstants.APPLY_ORDER_KEY:
          if(items.length){
            elem = items.map( order => <OrderItem key={order.app_id} data={order}  cancelClick={this.handleApplyCancel}/>);
          }
          else{
            elem = <div className="failure"><p>没有申请ಠ_ಠ</p></div>
          }
      }
    }

    return (<div className="daOrders">
      {elem}
      {pagination}
      <Modal isOpen={this.state.modalCancelIsOpen} onClose={this.handleCloseModal}>
        {this.state.isSuccessful?
          <div className="submitForm">
            <p className="main">{this.state.isNormalOrder?'提交申请成功(✪ω✪)':'提交申请成功，我们将会审核(✪ω✪)'}</p>
            <ButtonNormal className="ButtonNormal submit" text="关闭"
                          svg={paperplane} onClick={this.handleRealSubmitClick}/>
          </div>
          :
          <div className="submitForm">
            <p className="main">确认要取消这个{this.state.isNormalOrder?'订单':'申请'}吗？</p>
            {
              this.state.isNormalOrder?null:
              <div className="inputEffectAgain">
                <input type="text" value={this.state.applyReason} onChange={this.handleApplyReasonChange}/>
                <label className={this.state.applyReason.length?'active':null}>申请理由</label>
              </div>
            }
            <p>{this.state.realErrMsg}</p>
            <ButtonNormal className="ButtonNormal submit" text={this.state.isSubmitting?'提交中……':'提交申请'} svg={paperplane} onClick={this.handleRealSubmitClick}/>
          </div>
        }
      </Modal>
    </div>);
  }

});


export default SellOrders;