'use strict';

import React from 'react';
import ButtonNormal from '../ButtonNormal';
import {addtocart} from '../SVGs';
import CartActions from '../../actions/CartActions';
import DetailActions from '../../actions/DetailActions';
import router from '../../router';
import Types from '../../utils/Types';

require('./BookCard.scss');


const BookCard = React.createClass({

  handleBuyClick(){
    let item = this.props.item;
    item.num = 1;
    CartActions.cartAdd(item);
  },
  handleDetailClick(e){
    e.preventDefault();
    DetailActions.getNewDetail(this.props.item);
    console.log('temp detail',this.props.item);
  },
  render() {
    const item = this.props.item;
    console.log('Book Card', item);
    return (
      <div className="bookCard">
        <a className="top" onClick={this.handleDetailClick} href={`/#/detail/${this.props.item.goods_id}`}>
          {
            this.props.item.user_id===-1?
              <div className="official">
                官方
              </div>:null
          }
          <div className="detail">
            <span>查看详情</span>
          </div>
          <img src={item.path.replace('Uploads/','Uploads/Thumb/')}/>
        </a>
        <div className="content">
          <div className="seller">
            <img src={item.upath.replace('Uploads/','Uploads/Thumb/')}/>
            <div className="controls">
              {item.nickname}
            </div>
          </div>
          <span>{Types[item.type_id]||'未知'}</span>
          <p>{item.name}</p>
          <div className="shop">
            <span className="price">{item.price?'¥' + item.price.toFixed(2):'免费'}</span>
            {
              item.quality?<ButtonNormal text="购买" svg={addtocart} onClick={this.handleBuyClick}/>:
                <span className="soldOut">已售空</span>
            }
          </div>
        </div>
      </div>
    );
  }

});


BookCard.propTypes = {
};

BookCard.defaultProps = {
};

export default BookCard;
