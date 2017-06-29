/**
 * Created by luye on 30/03/2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import Settings from './components/settings';
import Template from './tpl';
import ReportList from "./components/reportList";
import MonthlyChart from "./components/monthStat";
import NewProject from "./components/newProject.js";
import NewCheckInReport from "./components/newCheckInReport.js";
import EvaluationResult from "./components/evaluationResult.js";
import ExamResult from "./components/examResult.js";
import NewOnlineReport from "./components/newOnlineReport.js";
import NewMergeReport from "./components/newMergeReport.js";
import Login from "./components/login";
import CheckinReportHistoryPage from "./components/checkinReportHistoryPage.js";
import ViewReportInfo from "./components/viewReportInfo.js";

export default class Main extends React.Component {
  render() {
    document.title = '准入质量保障平台';
    return (
      <Router history={hashHistory}>
        <Route component={Template} path="/">
          <Route component={ReportList} path="reportList"></Route>
          <Route component={MonthlyChart} path="monthStat"></Route>
          <Route component={CheckinReportHistoryPage} path="checkinReportHistoryPage"></Route>
          <Route component={ViewReportInfo} path="viewReportInfo"></Route>
          <Route component={NewProject} path="newProject"></Route>
          <Route component={NewCheckInReport} path="newCheckInReport"></Route>
          <Route component={EvaluationResult} path="evaluationResult"></Route>
          <Route component={ExamResult} path="examResult"></Route>
          <Route component={NewOnlineReport} path="newOnlineReport"></Route>
          <Route component={NewMergeReport} path="newMergeReport"></Route>
          <Route component={Settings} path="settings"></Route>
        </Route>
        <Route component={Login} path="/login" />
      </Router>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('mainContainer'));
