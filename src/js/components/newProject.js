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
      name: "projectName",
      jira_id: "requirementID",
      tester_ctx: "tester",
      dropData: "App类",
      date_begin:"",
      date_end:"",
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
    //项目类型
    this.state.type = (this.state.dropData=="App类")?0:1;
    console.log(this.state); // 已经获取到新建项目的字段信息
    if(this.state.name ==""){
      alert("请输入完整项目信息");
    }else if(this.state.jira_id ==""){
      alert("请输入完整项目信息");
    }else if(this.state.tester_ctx ==""){
      alert("请输入完整项目信息");
    }else if(this.state.date_begin =="" || this.state.date_end ==""){
      alert("请输入完整项目信息");
    }else{
      //显示对话框
      this.setState({
        visible: true,
      });
    }
  }

  handleOk(e) {
    console.trace();
    console.log(e);

    console.log("new project submit info");
    console.log(this.state);

    //提交 新建项目信息
    api.postNewProject(this.state).then(data=>{
      console.log("new project post success");
      console.log(data.data);
      console.log(data.data.id);

      //获取 项目信息
      api.getNewProject(data.data.id).then(data=>{
        console.log("new project get success");
        console.log(data);
      });
    });

    //点击弹框中的 "是" -- 跳转到"准入报告列表"页
    window.location = 'index.html#/reportList';

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
    //下拉菜单 -  menu
    const dropData = ["App类", "非App类"];
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
            <Col span={4} className="title-txt">项目信息</Col>
          </Row>
          <Row gutter={16} style={{marginBottom: 16}}>
            <Col span={8}>
              <Input addonBefore="项目名称" defaultValue={this.state.name} name="name"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
            <Col span={8}>
              <Input addonBefore="需求ID" defaultValue={this.state.jira_id} name="jira_id"
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
              <Input addonBefore="测试人员" defaultValue={this.state.tester_ctx} name="tester_ctx"
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

  }

}