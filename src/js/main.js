/**
 * Created by luye on 30/03/2017.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import Essence from './components/essence';
import Essence1 from './components/essence1';
import Template from './tpl';

export default class Main extends React.Component {
  render() {
    document.title = 'zrzc';
    return (
      <Router history={hashHistory}>
        <Route component={Template} path="/">
          <Route component={Essence} path="essence"></Route>
          <Route component={Essence1} path="essence1"></Route>
        </Route>
      </Router>
    );
  }
}

ReactDOM.render(<Main/>, document.getElementById('mainContainer'));
