/**
 * Created by yang on 17/4/10.
 */
/*
 准入报告列表
 */
import React, {Component} from "react";
import {Link} from "react-router";
import {
  Input,
  Select,
  Icon,
  Row, Col,
  Menu, Dropdown,
  Button,
  DatePicker,

} from 'antd';
import moment from 'moment';
import "../../less/reportList.less";

//时间日期选择
const {MonthPicker, RangePicker} = DatePicker;
function onChange(date, dateString) {
  console.log(date);
  console.log(dateString);
}
//获取当前时间
function getNowTime(date) {
  let y, m, d;
  y = date.getFullYear();
  m = date.getMonth() + 1;
  d = date.getDate();
  return ( y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) );
}

export default class ReportList extends Component {
  //状态初始化 -- input输入框 和 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      requirement: "xuqiu",
      reporter: "reporter",
      dateSubmit: "dateSubmit",
      dep2: "dep2",
      dep1: "dep1",
      team: "team",
      dropData: "未通过",

    };
  }

  //下拉列表-事件处理
  menuOnclick(e) {
    console.log('click', e.key);
    this.setState({
      dropData: e.key,
    });
  }

  //输入框 -- onChange事件处理
  handleChange(e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    //
    this.setState(obj);
    console.log(this.state);

  }

  render() {
    //当前时间
    let currDate = new Date();
    let currTime = getNowTime(currDate);

    //下拉菜单 - menu
    const dropData = ["通过", "未通过", "待审核", "自动通过"];
    const dropMenu = (
      <Menu onClick={this.menuOnclick.bind(this)}>
        <Menu.Item key={dropData[0]}>
          <p>{dropData[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[1]}>
          <p>{dropData[1]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[2]}>
          <p>{dropData[2]}</p>
        </Menu.Item>
        <Menu.Item key={dropData[3]}>
          <p>{dropData[3]}</p>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="需求名称" defaultValue={this.state.requirement} name="requirement"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="报告人姓名" defaultValue={this.state.reporter} name="reporter"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <span className="dateSubmit0">提交时间</span>
            <div className="divDateSubmit0">
              <DatePicker defaultValue={moment(currTime)} onChange={onChange}/>
            </div>
          </Col>
          <Col span={6} className="examResult">
            <span>审核结果</span>
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
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="二级部门" defaultValue={this.state.dep2} name="dep2"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="一级部门" defaultValue={this.state.dep1} name="dep1"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="责任人团队" defaultValue={this.state.team} name="team"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
        </Row>
        <Row>
          <Col span={6}></Col>
          <Col span={6}><Button style={{marginLeft: 4}} type="primary"
                                onClick={()=>window.location = 'index.html#/newProject'}>新建项目</Button></Col>
          <Col span={6}><Button style={{marginLeft: 8}} type="primary">查询</Button></Col>
        </Row>

        <div id="tb-div"></div>

      </div>

    );
  }
}

