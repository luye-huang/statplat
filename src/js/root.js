import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, hashHistory} from 'react-router';
import Index from './index';
import ComponentList from './components/list';
import ComponentDetail from './components/detail';

export default class Root extends React.Component{
  render(){
    return(
      <Router history={hashHistory}>
        <Route component = {Index} path="/">
          <Route component = {ComponentDetail} path="detail"></Route>
        </Route>
        <Route component = {ComponentList} path="list"></Route>
      </Router>
    );
  }
}
ReactDOM.render(<Root/>, document.getElementById('example'));
