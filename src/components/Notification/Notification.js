'use strict';

import React from 'react';
import PureRenderMixin from 'react/lib/ReactComponentWithPureRenderMixin';
import {close, must} from '../SVGs';
import NotificationStore from '../../stores/NotificationStore';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import NotificationActions from '../../actions/NotificationActions';
require('./Notification.scss');

//css动画时间

const Notification = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState(){
    return {notifications: NotificationStore.getNotifications()};
  },
  _onNotificationChange(){
    this.setState({notifications: NotificationStore.getNotifications()});
  },
  componentWillMount() {
    NotificationStore.addChangeListener(this._onNotificationChange);
  },

  componentWillUnmount(){
    NotificationStore.removeChangeListener(this._onNotificationChange);
  },
  handleClose(key){
    return ()=>{
      console.log(key);
      NotificationActions.deleteNotification(key);
    };
  },
  render() {
    console.log('render notification');
    const notifications = this.state.notifications;
    return (
      <div className={`notification${notifications.size?' active':''}`}>
        <div className="inner">
          {must}
          <ReactCSSTransitionGroup transitionName="t">
          {
            notifications.map((data, key)=>
                <div className="item" key={data[0]+data[1]+key} onClick={this.handleClose(key)}>{data}
                  <div className="close">{close}</div>
                </div>
            )
          }
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }

});

Notification.propTypes = {
};

Notification.defaultProps = {
};

export default Notification;
