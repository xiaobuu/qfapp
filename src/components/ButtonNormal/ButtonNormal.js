'use strict';

import React from 'react';

require('./ButtonNormal.scss');

export default class ButtonNormal extends React.Component {

  render() {
    var { text } = this.props;
    return (
      <button className="ButtonNormal" data-text={text}>
        <span>{text}</span>
      </button>
    );
  }

}

ButtonNormal.propTypes = {
};

ButtonNormal.defaultProps = {
};
