var React = require('react');
var ReactDOM = require('react-dom');
import ComponentHeader from './components/header';
import ComponentFooter from './components/footer';
import BodyIndex from './components/bodyIndex';
import 'antd/dist/antd.css';

export default class Index extends React.Component{
  render(){
    return(   //return only one dom
      <div>
        <ComponentHeader/>
        <BodyIndex id={250} />
        <div>
					{this.props.children}
				</div>
        <ComponentFooter/>
      </div>
    )
  }
}
