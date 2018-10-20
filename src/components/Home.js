import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import ContentHeader from 'c/ContentHeader';
import TrafficChart from 'c/TrafficChart';
import TrafficNow from 'c/TrafficNow';
import s0 from 'c/Home.module.scss';

class Home extends Component {
  // static propTypes = {
  //   match: PropTypes.object
  // };

  render() {
    // const { match } = this.props;
    return (
      <div>
        <ContentHeader title="Overview" />
        <div className={s0.root}>
          <div>
            <TrafficNow />
          </div>
          <div className={s0.chart}>
            <TrafficChart />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
