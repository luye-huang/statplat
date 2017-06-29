/**
 * Created by yang on 17/4/11.
 */

/*
 新建项目信息
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
import {dealUrl} from "../api.js";
import moment from 'moment';

//时间日期选择
const {MonthPicker, RangePicker} = DatePicker;

//获取当前时间
function getNowTime(date) {
  let y, m, d;
  y = date.getFullYear();
  m = date.getMonth() + 1;
  d = date.getDate();
  return ( y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) );
}

var currDate, currTime;//当前时间
currDate = new Date();
currTime = getNowTime(currDate);

let arr_jira_id=[];
let _date_begin, _date_end;
export default class newProject extends Component {
  //初始化状态
  constructor(props) {
    super();
    this.state = {
      visible: false,
      name: "",
      jira_id: "",
      testers: "",
      dropData: "App类",
      date_begin: currTime, //测试周期:初始化为当前日期
      date_end: currTime ,  //测试周期:初始化为当前日期
      _defaultValue: "",
      work_id:"",
    };
  }

  //时间日期选择 -- 事件处理
  onChange(date, dateString) {
    this.setState({
      date_begin:dateString[0],
      date_end:dateString[1],
    });
  }

  //对话框
  showModal() {
    //项目类型
    this.state.type = (this.state.dropData=="App类")?0:1;
    
    if(this.state.name ==""){
      alert("请输入完整项目信息");
    }else if(this.state.jira_id ==""){
      alert("请输入完整项目信息");
    }else if(this.state.testers ==""){
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

  //取消
  btnCancel(){
    window.location = 'index.html#/reportList';
  }

  handleOk(e) {
    //console.log(e);
    
    if(this.state.work_id==undefined){ //新建 -- 项目信息
      //提交 新建项目信息
      api.postNewProject(this.state).then(data=>{
        if(data.status === 200){
          alert("新建项目信息:" + data.message);
          console.log(data.data);
          //点击弹框中的 "是" -- 跳转到"准入报告列表"页
          window.location = 'index.html#/reportList';
        }else if(data.status == 21 || data.status == 1){
          alert("新建项目信息:" + data.message);
        }
      });
    }else{ // 修改 --  项目信息
      api.postEditProjectInfo(this.state).then(data=>{
        console.log(data);
        if(data.status == 200){
          alert("修改项目信息:" + data.message);
          window.location = 'index.html#/reportList';
        }else if(data.status == 21 || data.status == 1){
          alert("修改项目信息:" + data.message);
        }
      });
    }

    this.setState({
      visible: false,
    });
    
  }

  handleCancel(e) {
    this.setState({
      visible: false,
    });
  }

  //下拉列表-事件处理
  menuOnclick(e) {
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
    this.state[e.target.name] = e.target.value;
    if(["jira_id"].includes(e.target.name) && this.state.jira_id!=undefined){
      const {jira_id} = this.state;
      let name;
      arr_jira_id = []; //数组的arr_jira_id,要在这里置空
      arr_jira_id.push(jira_id);
      if(jira_id.includes(",")){
        arr_jira_id = []
        arr_jira_id = jira_id.split(",");
      }
      obj["jira_id"] = arr_jira_id;
      this.setState(obj);
      api.getSummaryFromId(arr_jira_id).then(data => {
        //console.log(data);
        if(data.status == 200){
          name = data.data.map(ele => {
            return ele.summary;
          });
          name = name.join(";"); //将数组转换成字符串显示
          this.setState({name});
        }
      });
    }
  }

  componentWillMount(){
    //解析从 查看项目信息页面 传过来的url,和其中的参数work_id / _date_begin / _date_end
    let url = window.location.href;
    let obj = dealUrl(url);
    this.state.work_id= obj["work_id"];
    _date_begin = obj["_date_begin"];
    _date_end = obj["_date_end"];
    this.setState({});
    
    if(this.state.work_id!=undefined){
      api.getNewProject(this.state.work_id).then(data=>{
        //console.log(data);
        if(data.status === 200){
          this.setState(data.data);

          this.setState({
            dropData: this.state.type==1?"非App类":(this.state.type==0?"App类":this.state.dropData),
          });
        }
      });
    }
  }

  render() {
    // RangePicker 时间控件,初始值的动态显示 -- 是取的[上一个页面传过来]的测试周期的:开始时间和结束时间
    if(this.state.work_id!=undefined){
      this.state.date_begin = _date_begin;
      this.state.date_end = _date_end;
    }

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
            <Col span={24} className="title-txt" style={{ textAlign:"center" }}>
              项目信息
            </Col>
          </Row>
          <Row gutter={16} style={{marginBottom: 16}}>
            <Col span={12}>
              <Input addonBefore="需求ID" placeholder="Jira ID (多个需求ID用 英文逗号, 隔开)" value={this.state.jira_id} name="jira_id"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
            <Col span={12}>
              <Input addonBefore="需求名称" defaultValue={this.state.name} name="name" value={this.state.name}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row gutter={16} style={{marginBottom: 16}}>
            <Col span={12}>
              <Input addonBefore="版本" placeholder="版本名称" value={this.state.version} name="version"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
            <Col span={12} className="exam-result">
              <span className="width-css">项目类型</span>
              <div className="width-div-css">
                <Dropdown overlay={dropMenu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData
                    }
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
          <Row gutter={16} style={{marginBottom: 40}}>
            <Col span={12}>
              <span className="date-css ">测试周期</span>
              <div className="div-date-css">
                <RangePicker defaultValue={[moment(this.state.date_begin),moment(this.state.date_end)]}
                             onChange={this.onChange.bind(this)} name="dateSubmit"/>
              </div>
            </Col>
            <Col span={12}>
              <Input addonBefore="测试人员" value={this.state.testers} name="testers"
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={8}></Col>
            <Col span={5}><Button onClick={this.btnCancel.bind(this)}>取消</Button></Col>
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