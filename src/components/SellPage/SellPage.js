'use strict';

import React from 'react';
import SellStore from '../../stores/SellStore';
import UserStore from '../../stores/UserStore';

import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import UserConstants from '../../constants/UserConstants';

import {boxface, additem, paperplane} from '../SVGs';
import ButtonNormal from '../ButtonNormal';
import Modal from '../Modal';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import {Link} from 'react-router';


import ItemRegisterForm from '../ItemRegisterForm';
import ItemRegisterFormC2C from '../ItemRegisterFormC2C';
import RequireLogin from '../../mixins/RequireLogin';


import UserActions from '../../actions/UserActions';
require('./SellPage.scss');

const SellPage = React.createClass({
  _onSellChange(){
    this.setState({
      realErrMsg: SellStore.getSubmitMsg(),
      isSubmitting: SellStore.getIsSubmitting(),
      isSuccessful: SellStore.getSuccess(),
      items: SellStore.getItems(),
      itemC2C: SellStore.getItemC2C()
    });
  },

  _onUserChange(){
    this.setState({
      phone: UserStore.getPhone(),
      alipay: UserStore.getAli()
    });
  },

  mixins: [PureRenderMixin, RequireLogin],
  getInitialState(){
    return {
      errMsg: '',
      b_NO: '',
      NO: '',
      modalSubmitIsOpen: false,
      showSuccess: false,
      sellType: 1,
      realErrMsg: SellStore.getSubmitMsg(),
      isSubmitting: SellStore.getIsSubmitting(),
      isSuccessful: SellStore.getSuccess(),
      items: SellStore.getItems(),
      itemC2C: SellStore.getItemC2C(),
      phone: UserStore.getPhone(),
      alipay: UserStore.getAli()
    };
  },

  componentWillMount(){
    SellStore.addChangeListener(this._onSellChange);
    UserStore.addChangeListener(this._onUserChange);

  },
  componentWillUnmount(){
    SellStore.removeChangeListener(this._onSellChange);
    UserStore.removeChangeListener(this._onUserChange);
  },

  handleAddClick(){
    UserActions.addNewSell();
  },

  handleSubmitClick(){
    if(this.state.sellType===1){
      let item = this.state.itemC2C.toJS();
      // 处理日期
      let date = Math.round(Date.now()/1000); // unix time
      item.limit_time = date + item.timeSpan * 60 * 60 * 24 * 30; // in month
      delete item.timeSpan;
      // 处理照片
      let images = [];
      for (let image of item.imgs) {
        if (image.src.length) {
          images.push(image.path);
        }
      }
      delete item.imgs;
      UserActions.applySellSubmitC2C(item, images);
    }
    else {
      let errMsg = '';

      const items = this.state.items.toJS();
      let goodToGo = true;
      let i = 0;
      for (let key in items) {
        let state = items[key];
        i++;
        if (!state.name || state.name.length < 4) {
          errMsg += `${i}号物品，物品名至少需要4个字<br/>`;
          goodToGo = false;
        }
        else if (state.num < 1) {
          errMsg += `${i}号物品，物品数量需要至少为1<br/>`;
          goodToGo = false;
        }
      }
      if (goodToGo) {
        UserActions.applySellNew();
        this.setState({
          modalSubmitIsOpen: true
        });
      }
      //else{
      this.setState({errMsg});
      //}
    }
  },
  handleFormClose(id){
    return ()=> {
      UserActions.removeSell(id);
    };
  },
  handleModalSubmitClose(){
    this.setState({modalSubmitIsOpen: false});
  },
  handleBNOChange(e){
    this.setState({b_NO: e.target.value});

  },
  handleNOChange(e){
    this.setState({NO: e.target.value});
  },
  handleValueChange(id){
    return (key, value)=> {
      UserActions.changeData(id, key, value);
    };
  },
  handleValueChangeC2C(key, value){
    UserActions.changeDataC2C(key, value);
  },
  handleImageChangeC2C(key, value){
    UserActions.changeImageC2C(key, value);
  },
  handleC2CSuccessClick(){
    this.setState({isSuccessful: false});
  },
  handleRealSubmitClick(){
    if(this.state.isSuccessful){
      //关闭Modal
      this.setState({
        modalSubmitIsOpen: false
      });
      setTimeout(()=>{
        this.setState({
          isSuccessful: false
        });
      },500);
      return;
    }
    if(!this.state.isSubmitting){
      //this.setState({realErrMsg)
      //检查宿舍楼
      if(!this.state.NO.length)
      {
        this.setState({realErrMsg: '宿舍号不能为空'});
        return;
      }
      else
      if(!this.state.b_NO.length)
      {
        this.setState({realErrMsg: '宿舍楼号不能为空'});
        return;
      }
      let items = this.state.items.toJS();

      let toSubmit = [];

      for(let key in items) {
        let state = items[key];
        let {price, time, detail, num, name} = state;
        if(price[price.length-1]==='.'){
          price.substring(0,price.length-1)
        }
        price = parseFloat(price);
        let limit_time = time;
        toSubmit.push({
          name, price, num, detail, limit_time
        });
      }

      console.log('about to submit', toSubmit);
      let realData = {
        b_NO: this.state.b_NO,
        NO: this.state.NO,
        info: JSON.stringify(toSubmit)
      };

      UserActions.applySellSubmit(realData);
    }
  },

  handleSellTypeClick(type) {
    return ()=>{
      this.setState({sellType: type});
    }
  },
  render(){
    if(this.state.isSuccessful){
      document.title='提交成功.(｡￫‿￩｡) - 清风';
    }
    else if(this.state.modalSubmitIsOpen){
      document.title='即将提交(ﾟ∀ﾟ )ิ  - 清风';
    }
    else{
      document.title='出售物品 - 清风';
    }
    const items = this.state.items.toJS();
    const size =  this.state.items.size;
    const {sellType, itemC2C} = this.state;
    let titleClass = `title${size?' active':''}`;
    if(true){ //this.state.phone
      return (
        <div className="sellPage">
          <h2 className="sellType"><span className={sellType===0?'active':null} onClick={this.handleSellTypeClick(0)}>寄卖</span> | <span className={sellType===1?'active':null} onClick={this.handleSellTypeClick(1)}>友易</span></h2>
          <div className="inner">
              {
                sellType===0?
                  <div className="sellItems">

                    <div className={titleClass} >
                      {boxface}
                    <span>
                      只需填写闲置物品信息，<br/>
                      即可轻松售卖物品。
                    </span>
                    </div>
                    <ul className="items">
                      <ReactCSSTransitionGroup transitionName="t">
                        {
                          Object.keys(items).map((key)=>{
                            let data = items[key];
                            if(!data) {
                              return;
                            }
                            let id = data.id;
                            return <ItemRegisterForm key={id} data={data} onClose={this.handleFormClose(id)} onValueChange={this.handleValueChange(id)}/>;
                          })
                        }
                      </ReactCSSTransitionGroup>
                    </ul>
                    <p className={`err ${this.state.errMsg?'active':''}`} dangerouslySetInnerHTML={{__html: this.state.errMsg}}></p>
                    <div className="controls">
                      <ButtonNormal text={size?'继续添加':'添加物品'} svg={additem} onClick={this.handleAddClick}/>
                      {
                        size?
                          <ButtonNormal className="ButtonNormal submit" text="提交申请" svg={paperplane} onClick={this.handleSubmitClick}/>
                          :null
                      }
                    </div>
                    <div className="more">
                      在寄卖模式中，我们替您完成物品的拍照入库和销售<br/>您只需填写物品的基本信息，我们会安排人员收货～
                    </div>
                    <Modal isOpen = {this.state.modalSubmitIsOpen} onClose = {this.handleModalSubmitClose}>
                      {this.state.isSuccessful?
                        <div className="submitForm">
                          <p className="main">提交成功～审核通过后，我们就会前来取货！~</p>
                          {this.state.alipay?'':<p className="main">记得在个人信息页填写支付宝账号(￣▽￣)/</p>}
                          <ButtonNormal className="ButtonNormal submit" text="关闭"
                                        svg={paperplane} onClick={this.handleRealSubmitClick}/>
                        </div>
                        :
                        <div className="submitForm">
                          <p className="main">马上就好，还差一些信息</p>

                          <div className="inputEffectAgain">
                            <input type="text" value={this.state.b_NO} onChange={this.handleBNOChange}/>
                            <label className={this.state.b_NO.length?'active':null}>宿舍楼号</label>
                          </div>

                          <div className="inputEffectAgain">
                            <input type="text" value={this.state.NO} onChange={this.handleNOChange}/>
                            <label className={this.state.NO.length?'active':null}>宿舍号</label>
                          </div>
                          <p>{this.state.realErrMsg}</p>
                          <ButtonNormal className="ButtonNormal submit" text={this.state.isSubmitting?'提交中……':'正式提交'}
                                        svg={paperplane} onClick={this.handleRealSubmitClick}/>
                        </div>
                      }
                    </Modal>
                  </div>

                  :// 易友
                  <div className="sellItems">

                  <div className={titleClass} >
                    {boxface}
                    <span>
                      填写物品资料，<br/>
                      亲自和小伙伴交易物品。
                    </span>
                  </div>

                  {this.state.isSuccessful?
                    <div>
                      <h2>物品上架成功～</h2>
                      <div className="controls">
                        <ButtonNormal className="ButtonNormal submit" text="继续提交" svg={paperplane} onClick={this.handleC2CSuccessClick}/>
                      </div>
                    </div> :
                    <div>
                      <ItemRegisterFormC2C data={itemC2C} onValueChange={this.handleValueChangeC2C} onImageChange={this.handleImageChangeC2C}/>
                      <p className={`err ${this.state.errMsg?'active':''}`} dangerouslySetInnerHTML={{__html: this.state.errMsg}}></p>
                      <p className="errorC2C">{this.state.realErrMsg}</p>
                      <div className="controls">
                        <ButtonNormal className="ButtonNormal submit" text={this.state.isSubmitting?'提交中……':'开始售卖'} svg={paperplane} onClick={this.handleSubmitClick}/>
                      </div>
                    </div>
                  }


                  <div className="more">
                    在友易模式中，您需要亲自填写物品上传图片并完成物品的交易<br/>担保模式我们会对交易款项进行担保，自由交易您可以自由设置交换条件～
                  </div>
                </div>
                }

            </div>

        </div>
      );
    }
    else{
      return <div className="sellPage">
          <div className="inner">
            <div className="title" >
              {boxface}
              <span>
                发布物品前，需要先填好手机号<br/>
                <Link to="my" params={{section: 'info'}}><ButtonNormal className="ButtonNormal goMy" text="前去填写" onClick={this.handleGoToMyInfo}/></Link>
              </span>
            </div>
          </div>
        </div>
    }


  }



});


export default SellPage;
