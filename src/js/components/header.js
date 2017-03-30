import React from 'react';
import {Link} from 'react-router';

export default class ComponentHeader extends React.Component {
    constructor() {
        super();
        this.state = {
            isGreen: false
        }
    }
    hoverHeaderColor() {
        this.setState({
            isGreen: !this.state.isGreen
        });
        console.log(this.state.isGreen);
    }
    render() {
        const styleHeader = {
            header: {
                backgroundColor: (this.state.isGreen) ? 'green' : 'red'
            }
        }
        return (
          <header style={styleHeader.header} onClick={this.hoverHeaderColor.bind(this)}>
            <h1>this is header123333</h1>
            <p>{this.props.username}</p>
            <ul>
              <li><Link to={`/`}>首页</Link></li>
              <li><Link to={`/detail`}>嵌套的详情页面</Link></li>
              <li><Link to={`/list/${this.state.isGreen}`}>列表页面</Link></li>
            </ul>
          </header>
        )
    }
}
