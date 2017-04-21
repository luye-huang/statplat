/**
 * Created by yang on 17/4/11.
 */

/*
 新建项目
 */
import React, {Component} from "react";
import "../../less/newProject.less";

import {
  Input,
  Icon,
  Row, Col,
  Menu, Dropdown,
  Button,
  DatePicker,
  Modal,
} from "antd";
import {api} from "../api.js";
import {domain} from "../api.js";
import $ from "jquery";

//时间日期选择
const {MonthPicker, RangePicker} = DatePicker;

export default class newProject extends Component {
  //初始化状态
  constructor(props) {
    super();
    this.state = {
      visible: false,
      projectName: "projectName",
      requirementID: "requirementID",
      tester: "tester",
      dropData: "APP类",
      date_begin:"",
      date_end:"",

      id:"8",
    };
  }

  //时间日期选择 -- 事件处理
  onChange(date, dateString) {
    console.log(date);
    console.log(dateString);
    this.setState({
      date_begin:dateString[0],
      date_end:dateString[1],
    });
  }

  //对话框
  showModal() {
    this.setState({
      visible: true,
    });
    console.log(this.state); // 已经获取到新建项目的字段信息
  }

  handleOk(e) {
    console.trace();
    console.log(22);
    console.log(e);

    //提交 新建项目信息
    api.postNewProject("app类测试项目1",0,"EE-203","2017-4-20","2017-4-21").then(data=>{
      console.log(1111);
      console.log(data);
    });
    
    window.location = 'index.html#/newCheckInReport';
    this.setState({
      visible: false,
    });
    
  }

  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  //下拉列表-事件处理
  menuOnclick(e) {
    console.log('click', e.key);
    this.setState({
      dropData: e.key,
    });
  }

  //输入框 - 事件处理
  handleChange(e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    //更改状态
    this.setState(obj);
    // console.log(this.state);
  }

  render() {
    //下拉菜单 - menu
    const dropData = ["APP类", "非APP类"];
    const dropMenu = (
      <Menu onClick={this.menuOnclick.bind(this)}>
        <Menu.Item key={dropData[0]}>
          <p>{dropData[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[1]}>
          <p>{dropData[1]}</p>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <div>
          <Row style={{marginBottom: 20}}>
            <Col span={10}></Col>
            <Col span={4} className="title-txt">新建项目</Col>
          </Row>
          <Row gutter={16} style={{marginBottom: 16}}>
            <Col span={8}>
              <Input addonBefore="项目名称" defaultValue={this.state.projectName} name="projectName"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
            <Col span={8}>
              <Input addonBefore="需求ID" defaultValue={this.state.requirementID} name="requirementID"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
            <Col span={8} className="exam-result">
              <span>项目类型</span>
              <div>
                <Dropdown overlay={dropMenu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
          <Row gutter={16} style={{marginBottom: 40}}>
            <Col span={12}>
              <span className="date-submit">测试周期</span>
              <div className="div-date-submit">
                <RangePicker defaultValue={[null, null]} onChange={this.onChange.bind(this)} name="dateSubmit"/>
              </div>
            </Col>
            <Col span={12}>
              <Input addonBefore="测试人员" defaultValue={this.state.tester} name="tester"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}></Col>
            <Col span={5}><Button>取消</Button></Col>
            <Col span={8}>
              <Button type="primary" onClick={this.showModal.bind(this)}>提交</Button>
              <Modal className="submitModal" title="提交确认" visible={this.state.visible}
                     onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}
                     okText="是" cancelText="否">
                <p>确认提交项目信息?</p>
              </Modal>
            </Col>
          </Row>
        </div>

      </div>
    );
  }

  componentDidMount(){
    let id = this.state.id;
    //获取 新建项目信息
    api.getNewProject(id).then(data=>{
      console.log(data);
    });
  }

}