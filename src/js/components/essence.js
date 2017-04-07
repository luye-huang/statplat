/**
 * Created by luye on 29/03/2017.
 */
import React from 'react';
import {MockApi} from '../mock';
import {str} from '../mock';
import {Row, Col, Button, Input} from 'antd';
// require("babel-polyfill");

export default class Essence extends React.Component {
  constructor() {
    super();
    this.state = {requirement: 'commence'}
  }

  handleChange(e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    // 滞后
    this.setState(obj);
    console.log(this.state);
    // console.log(this.refs.requirement.refs.input.value);
  }

  render() {
    let str = 'hahah';
    // console.log(MockApi.getListMock());
    // console.log(str);
    return (
      <div>
        <Row gutter={16}>
          <Col span={6}><Input addonBefore="需求名称" defaultValue={this.state.requirement} name="requirement"
                               onChange={this.handleChange.bind(this)}/></Col>
          <Col span={6}><Input addonBefore="报告人姓名" defaultValue={this.state.reporter} name="reporter"
                               onChange={this.handleChange.bind(this)}/></Col>
          <Col span={6}><Input addonBefore="提交时间" defaultValue={this.state.dateSubmit} name="dateSubmit"
                               onChange={this.handleChange.bind(this)}/></Col>
          <Col span={6}>s</Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}><Input addonBefore="二级部门" defaultValue={this.state.dep2} name="dep2"
                               onChange={this.handleChange.bind(this)}/></Col>
          <Col span={6}><Input addonBefore="一级部门" defaultValue={this.state.dep1} name="dep1"
                               onChange={this.handleChange.bind(this)}/></Col>
          <Col span={6}><Input addonBefore="责任人团队" defaultValue={this.state.team} name="team"
                               onChange={this.handleChange.bind(this)}/></Col>
          <Col span={6}>s</Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>ss</Col>
          <Col span={6}><Button type="primary">新建</Button></Col>
          <Col span={6}><Button type="primary">查询</Button></Col>
          <Col span={6}>s</Col>
        </Row>
        <div id="tb-div"></div>
      </div>
    )
  }

  componentDidMount() {

  }
}
