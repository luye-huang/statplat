/**
 * Created by luye on 30/03/2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import Essence from './components/essence';
import Essence1 from './components/essence1';
import Settings from './components/settings';
import Template from './tpl';

import Option3 from "./components/option3.js";
import Test2 from "./components/test2.js";
import ReportList from "./components/reportList.js";
import MonthlyChart from "./components/monthlyChart.js";
import NewProject from "./components/newProject.js";


export default class Main extends React.Component {
  render() {
    document.title = 'zrzc';
    return (
      <Router history={hashHistory}>
        <Route component={Template} path="/">
          <Route component={Essence} path="essence"></Route>
          <Route component={Essence1} path="essence1"></Route>

          <Route component={ReportList} path="reportList"></Route>
          <Route component={MonthlyChart} path="monthlyChart"></Route>
          <Route component={NewProject} path="newProject"></Route>
          <Route component={Option3} path="option3"></Route>
          <Route component={Test2} path="test2"></Route>

          <Route component={Settings} path="settings"></Route>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('mainContainer'));
