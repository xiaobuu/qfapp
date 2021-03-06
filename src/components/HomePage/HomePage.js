'use strict';

import React from 'react';
import Banner from '../Banner';
import InputLarge from '../InputLarge';
import ButtonNormal from '../ButtonNormal';
import WordsFlasher from '../WordsFlasher';
import RegForm from '../RegForm';
import AppStore from '../../stores/AppStore';
import AppActions from '../../actions/AppActions';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import router from '../../router';

import BookCard from '../BookCard';
import ItemShowcase from '../ItemShowcase';

import {coffecup, shoppingbag, truck} from '../SVGs';
import PageStore from '../../stores/PageStore';
import PageActions from '../../actions/PageActions';

require('./HomePage.scss');



const HomePage = React.createClass({
  mixins: [PureRenderMixin],

  _onPageChange(){
    this.setState({
      searchText: PageStore.getKeyWord()
    })
  },

  componentDidMount(){
    document.title='清风 | 轻松交易闲置物品';
  },
  componentWillMount(){
    PageStore.addChangeListener(this._onPageChange);
  },
  componentWillUnmount(){
    PageStore.removeChangeListener(this._onPageChange);
  },

  getInitialState(){
    return {
      openedHow: false,
      textHow: '我们如何运作'
    };
  },
  handleHowClick(){
    console.log('how click');
    if(this.state.openedHow) {
      this.setState({
        openedHow: false,
        textHow: '我们如何运作'
      });
    }
    else{
      this.setState({
        openedHow: true,
        textHow: '回到搜索'
      });
    }
  },
  handleGoShoppingClick(){
    //this.setState({isGoShopping:true});
    router.transitionTo('shop');
  },
  handleSearchKey(e){
    if(e.keyCode===13){
      let text = this.state.searchText.substr(0,20);
      PageActions.setNewKeyword(text);
    }
  },
  handleSearchChange(e){
    this.setState({searchText: e.target.value});
  },
  handleSearchButton(){
    let text = this.state.searchText.substr(0,20);
    PageActions.setNewKeyword(text);
  },


  render() {
    return (
      <div className="homePage">
        <section className="FirstSection">
          <div className="inner">
            <h3 className="subtle">最便捷闲置物品交易平台，仅在同济大学嘉定校区</h3>
            <h1 className="main">轻松购买闲置的<WordsFlasher/></h1>
            <InputLarge placeholder="找找闲置的宝贝" btnText="搜索" svg={coffecup} value={this.state.searchText} onChange={this.handleSearchChange} onKeyUp={this.handleSearchKey} buttonOnClick={this.handleSearchButton}/>
            <div className={`how${this.state.openedHow?' active':''}`}>
              <ul className="inner">
                <h2>出售</h2>
                <li>
                  <h2>收</h2>
                  <p>您在清风发布闲置物品，我们派专人上门收取物件</p>
                </li>
                <li>
                  <h2>存</h2>
                  <p>我们将您的物件拍照发布，存放于我们的仓库中</p>
                </li>
                <li>
                  <h2>售</h2>
                  <p>在物品售出后，您将会获得属于自己的收入（推广期100%哦～）</p>
                </li>
                <div className="buyer">
                  <h2>购买</h2>
                  <p>买买买！尽快下单，以免好东西被别人先买走～<br/>购物车下单后，我们一旦打包完成，将联系您中午至F楼取货～</p>
                </div>
              </ul>
            </div>
            <ButtonNormal className={`ButtonNormal${this.state.openedHow?' opened':''}`} text={this.state.textHow} onClick={this.handleHowClick}/>

          </div>
        </section>
        <section className="SecondSection">
          <header>
            {shoppingbag}
            <h2>每日新品</h2>
            <p>想淘最新最好的便宜货，就在这里</p>
          </header>
          <main>
            <ItemShowcase/>
          </main>
          <ButtonNormal text="前去淘货" onClick={this.handleGoShoppingClick}/>
        </section>
        <section className="ThirdSection">
          <svg height="100" viewBox="0 40 100 100" preserveAspectRatio="none"><path d="M-5 100q5-80 10 0zm5 0q5-100 10 0m-5 0q5-70 10 0m-5 0q5-90 10 0m-5 0q5-70 10 0m-5 0q5-110 10 0m-5 0q5-90 10 0m-5 0q5-70 10 0m-5 0q5-90 10 0m-5 0q5-50 10 0m-5 0q5-80 10 0m-5 0q5-60 10 0m-5 0q5-40 10 0m-5 0q5-50 10 0m-5 0q5-80 10 0m-5 0q5-55 10 0m-5 0q5-70 10 0m-5 0q5-80 10 0m-5 0q5-50 10 0m-5 0q5-75 10 0m-5 0q5-85 10 0z"/></svg>
          <div className="inner">
            {truck}
            <div className="left">
              <h3 className="minor">拥有闲置物品？</h3>
              <h2 className="huge">在清风上出售<br/>享受前所未有的便利</h2>
              <p className="more">
                只需轻敲键盘，我们就将派人上门收取宝贝<br/>并完成宝贝的拍照、入库、出售所有工作<br/>另外，欢迎关注我们的微信公众号:qfplan，提供更多服务</p>
            </div>
            <div className="right">
              <RegForm/>
            </div>
          </div>
        </section>
        <footer>
          <div className="inner">
            <div className="leftOne">
              <h3>关注清风</h3>
              <p>欢迎关注我们的公众号:qfplan</p>
              <img className="qr" src={require('./code.jpg')}/>
            </div>

            <div className="left">
              <h3>清风秒杀</h3>
              <p>每周二，22:22分 <br/>
                我们将在用户寄卖的物品中挑选出最佳的物品 <br/>
                在秒杀时间开始后逐个物品进行上线 <br/>
                秒杀的物品将在秒杀前几天通过微信公众号进行告知<br/>
                一切精彩，尽在清风平台</p>
            </div>

            <div className="right">
              <h3>联系我们</h3>
              <p>我们欢迎您的联系
                <br/>邮件：wenke@qfplan.com<br/>
                QQ群：488083052<br/>
                微博：qfplan
              </p>

            </div>

            <div className="copyright">
              沪ICP备14028921号-2  Copyright © 2015 清风
            </div>
          </div>


        </footer>
      </div>
    );
  }
});
export default HomePage;
