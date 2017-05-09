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
import ReportList from "./components/reportList";
import MonthlyChart from "./components/monthStat";
import NewProject from "./components/newProject.js";
import NewCheckInReport from "./components/newCheckInReport.js";
import EvaluationResult from "./components/evaluationResult.js";
import ExamResult from "./components/examResult.js";
import NewOnlineReport from "./components/newOnlineReport.js";
import NewMergeReport from "./components/newMergeReport.js";
import CheckinReportHistoryPage from "./components/checkinReportHistoryPage.js";

export default class Main extends React.Component {
  render() {
    document.title = 'zrzc';
    return (
      <Router history={hashHistory}>
        <Route component={Template} path="/">
          <Route component={Essence} path="essence"></Route>
          <Route component={Essence1} path="essence1"></Route>

          <Route component={ReportList} path="reportList"></Route>
          <Route component={MonthlyChart} path="monthStat"></Route>
          <Route component={CheckinReportHistoryPage} path="checkinReportHistoryPage"></Route>
          
          <Route component={NewProject} path="newProject"></Route>
          <Route component={NewCheckInReport} path="newCheckInReport"></Route>
          <Route component={EvaluationResult} path="evaluationResult"></Route>
          <Route component={ExamResult} path="examResult"></Route>
          
          <Route component={NewOnlineReport} path="newOnlineReport"></Route>
          <Route component={NewMergeReport} path="newMergeReport"></Route>
          <Route component={Option3} path="option3"></Route>
          <Route component={Test2} path="test2"></Route>

          <Route component={Settings} path="settings"></Route>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('mainContainer'));
