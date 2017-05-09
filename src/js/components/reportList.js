/**
 * Created by yang on 17/4/10.
 */
/*
 准入报告列表
 */
import React, {Component} from "react";
import {
  Input,
  Icon,
  Row, Col,
  Menu, Dropdown,
  Button,
  Modal,
  DatePicker,
} from 'antd';
import moment from 'moment';
import "../../less/reportList.less";
import {api} from "../api.js";
import $ from "jquery";
import LuyeTable from "./luyeTable/luyeTable.js";

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

var currDate, currTime;//当前时间
currDate = new Date();
currTime = getNowTime(currDate);
let work_id;
let check_result; //审核结果
export default class ReportList extends Component {
  //状态初始化 -- input输入框 和 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      name: "",
      reporter_name: "",
      date_begin: "2017-04-18",
      date_end: currTime,
      dep1_name: "",
      dep2_name: "",
      dep3_name: "",
      dropData: "全部",
      checkinModal: false,
      onlineModal:false,
      mergeModal:false,
    };
  }

  //时间日期选择  -- 提交时间事件处理
  onChange(date, dateString) {
    console.log(date);
    console.log(dateString);
    //更改提交时间的状态
    this.setState({
      date_begin: dateString[0],
      date_end: dateString[1],
    });
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

  //提测对话框
  checkinModalOK() {
    //跳转到 -- 新建提测报告页面,并将work_id传过去
    window.location = "index.html#/newCheckInReport?work_id=" + work_id;
    this.setState({
      checkinModal:false,
    });
  }
  checkinModalCancel() {
    this.setState({
      checkinModal:false, //关闭对话框
    });
  }
  //上线对话框
  onlineModalOK() {
    //跳转到 -- 新建上线报告的页面,传递work_id
    window.location = "index.html#/newOnlineReport?work_id=" + work_id;
    this.setState({
      onlineModal:false,
    });
  }
  onlineModalCancel() {
    this.setState({
      onlineModal:false, //关闭对话框
    });
  }
  //合板对话框
  mergeModalOK(){
    //跳转到 -- 新建合板报告的页面,传递work_id
    window.location = "index.html#/newMergeReport?work_id=" + work_id;
    this.setState({
      mergeModal:false,
    });
  }
  mergeModalCancel() {
    this.setState({
      mergeModal:false, //关闭对话框
    });
  }

  render() {
    //下拉菜单 - menu
    const dropData = ["全部","通过", "未通过", "待审核"];
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
            <Input addonBefore="需求名称" defaultValue={this.state.name} name="name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="报告人姓名" defaultValue={this.state.reporter_name} name="reporter_name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={12}>
            <span className="date-submit0">提交时间</span>
            <div className="div-date-submit0">
              <RangePicker defaultValue={[moment(this.state.date_begin), moment(this.state.date_end)]}
                           onChange={this.onChange.bind(this)}/>
            </div>
          </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="一级部门" defaultValue={this.state.dep1_name} name="dep1_name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="二级部门" defaultValue={this.state.dep2_name} name="dep2_name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="三级部门" defaultValue={this.state.dep3_name} name="dep3_name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6} className="exam-result">
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
        <Row>
          <Col span={6}></Col>
          <Col span={6}><Button style={{marginLeft: 4}} type="primary"
                                onClick={()=>window.location = 'index.html#/newProject'}>新建项目</Button></Col>
          <Col span={6}><Button style={{marginLeft: 4}} type="primary"
                                onClick={ ()=> {
                                  this.getTbData();
                                } }
          >查 询</Button></Col>
        </Row>
        <Modal title="提交询问" visible={this.state.checkinModal}
               onOk={this.checkinModalOK.bind(this)} onCancel={this.checkinModalCancel.bind(this)}
               okText="是" cancelText="否"
        >
          <p>尚未提交提测报告,是否立即提交提测报告?</p>
        </Modal>
        <Modal title="提交询问" visible={this.state.onlineModal}
               onOk={this.onlineModalOK.bind(this)} onCancel={this.onlineModalCancel.bind(this)}
               okText="是" cancelText="否"
        >
          <p>尚未提交上线报告,是否立即提交上线报告?</p>
        </Modal>
        <Modal title="提交询问" visible={this.state.mergeModal}
               onOk={this.mergeModalOK.bind(this)} onCancel={this.mergeModalCancel.bind(this)}
               okText="是" cancelText="否"
        >
          <p>尚未提交合板报告,是否立即提交合板报告?</p>
        </Modal>
        <div id="tb-div"></div>
      </div>
    );
  }

  getTbData() {
    //审核结果 字符串解析成int型
    if(this.state.dropData == "全部"){
      check_result = -1;
    }else if(this.state.dropData == "待审核"){
      check_result = 0;
    }else if(this.state.dropData == "通过"){
      check_result = 1;
    }else if(this.state.dropData == "未通过"){
      check_result = 2;
    }
    this.state.check_result = check_result;
    console.log(this.state);
    //调用接口函数
    api.getReportList(this.state).then(data => {
      console.log("reportList get success");
      console.log(data);
      console.log(data.data);
      let arr = data.data;
      let typeStr = "", nodeStr = "",
        check_noteStr = "", check_resultStr = "",
        _nUrl = "";
      let nodeUrl = "index.html#/@@";
      for (let i = 0; i < arr.length; i++) {
        //项目类型
        arr[i]["typeStr"] = (arr[i].type == 0) ? "App类" : "非App类";
        //节点类型
        if (arr[i].node == 0) {
          nodeStr = "提测";
          _nUrl = "newCheckInReport";
        } else if (arr[i].node == 1) {
          nodeStr = "提测";
          _nUrl = "newCheckInReport";
          /*//非App类,type类型为1(提测,上线)
          if(arr[i].check_result==1 && arr[i].type == 1){
            nodeStr = "上线";
            _nUrl = "newOnlineReport";
          }
          //App类,type类型为0(提测,合板)
          if(arr[i].check_result==1 && arr[i].type == 0){
            nodeStr = "合板";
            _nUrl = "newMergeReport";
          }*/
        } else if (arr[i].node == 2 || arr[i].node == 3) {
          nodeStr = "上线";
          _nUrl = "newOnlineReport";
        } else if (arr[i].node == 4 || arr[i].node == 5) {
          nodeStr = "合版";
          _nUrl = "newMergeReport";
        }
        arr[i]["nodeStr"] = nodeStr;
        arr[i]["_nUrl"] = _nUrl;
        //评估结果
        if (arr[i].check_note == 0) {
          check_noteStr = "待评估";
        } else if (arr[i].check_note == 1) {
          check_noteStr = "蓝灯";
        } else if (arr[i].check_note == 2) {
          check_noteStr = "绿灯";
        } else if (arr[i].check_note == 3) {
          check_noteStr = "黄灯";
        } else if (arr[i].check_note == 4) {
          check_noteStr = "红灯";
        }
        arr[i]["check_noteStr"] = check_noteStr;
        //审核结果
        if (arr[i].check_result == 0) {
          check_resultStr = "待审核";
        } else if (arr[i].check_result == 1) {
          check_resultStr = "通过";
        } else if (arr[i].check_result == 2) {
          check_resultStr = "未通过";
        }
        arr[i]["check_resultStr"] = check_resultStr;
      }
      ;
      console.log(arr);
      //节点的跳转
      const redirectTo_NodeTest = (e)=> {
        //取到对应的工作流id
        work_id = e.data.id;
        console.log(work_id);
        //提测报告
        if(Object.is(e.data.node, 0)){
          this.setState({checkinModal: true}); //显示提测对话框
        }
        else if (Object.is(e.data.node, 1)) {

          window.location.href = "index.html#/newCheckInReport?work_id=" + work_id;
          /*// 非App类型,type=1, 且审核结果为1 ,进入上线报告
          if(Object.is(e.data.type, 1) && Object.is(e.data.check_result, 1)){
            window.location.href = "index.html#/newOnlineReport?work_id=" + work_id;
          }
          // App类型,type=0, 且审核结果为1 ,进入合板报告
          if(Object.is(e.data.type, 0) && Object.is(e.data.check_result, 1)){
            window.location.href = "index.html#/newMergeReport?work_id=" + work_id;
          }*/
        }
        //上线报告
        else if (Object.is(e.data.node, 2)) {
          this.setState({onlineModal: true}); //显示上线对话框
        }
        else if (Object.is(e.data.node, 3)) {
          window.location.href = "index.html#/newOnlineReport?work_id=" + work_id;
          //若上线审核通过,则隐藏上线报告页面的提交按钮
          if(Object.is(e.data.check_result, 1)){
            window.location.href = "index.html#/newOnlineReport?work_id=" + work_id + "&flag=0";
          }
        }
        //合板报告
        else if (Object.is(e.data.node, 4)) {
          this.setState({mergeModal: true}); //显示合板对话框
        }
        else if(Object.is(e.data.node, 5)){
          window.location.href = "index.html#/newMergeReport?work_id=" + work_id;
        }
      }
      //评估结论的跳转  -- 跳转到evaluationResult评估结论页面, pageTag=checkin
      const redirectTo_Checknote = (e)=>{
        work_id = e.data.id;
        if(Object.is(e.data.node, 0)){
          this.setState({checkinModal: true}); //显示提测对话框
        }
        else if(Object.is(e.data.node, 1)){ //跳转到提测的评估页面
          window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=checkin";
        }
        else if (Object.is(e.data.node, 2)) {
          this.setState({onlineModal: true}); //显示上线对话框
        }
        else if(Object.is(e.data.node, 3)){ //跳转到上线的评估页面
          window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=online";
          if(Object.is(e.data.check_result, 1)){
            window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=online&flag=0";
          }
        }
        else if (Object.is(e.data.node, 4)) {
          this.setState({mergeModal: true}); //显示合板对话框
        }
        else if(Object.is(e.data.node, 5)){ //跳转到合板的评估页面
          window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=merge";
        }
      }
      //审核结果的跳转 -- 跳转到examResult审核结果页面,
      const redirectTo_CheckResult = (e)=>{
        work_id = e.data.id;
        if(Object.is(e.data.node, 0)){
          this.setState({checkinModal: true}); //显示提测对话框
        }
        else if(Object.is(e.data.node, 1)){ //跳转到提测的审核页面
          window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=checkin";
        }
        else if (Object.is(e.data.node, 2)) {
          this.setState({onlineModal: true}); //显示上线对话框
        }
        else if(Object.is(e.data.node, 3)){ //跳转到上线的审核页面
          window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=online";
          //若上线审核通过,则隐藏 审核页面 的提交按钮
          if(Object.is(e.data.check_result, 1)){
            window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=online"+ "&flag=0";
          }
        }
        else if (Object.is(e.data.node, 4)) {
          this.setState({mergeModal: true}); //显示合板对话框
        }
        else if(Object.is(e.data.node, 5)){ //跳转到合板的审核页面
          window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=merge";
        }
      }
      //表格数据渲染
      var tbParam = {
        el: $("#tb-div"),
        data: arr,
        columns: [{cname: "报告ID", cdata: "id"},
          {cname: "需求名称", cdata: "name"},
          {cname: "需求ID", cdata: "jira_id"},
          {cname: "项目类型", cdata: "typeStr"},
          {cname: "报告人姓名", cdata: "tester_ctx"},
          // {cname:"节点",cdata:"nodeStr",type:"a", url:nodeUrl, params:["_nUrl"]},
          {cname: "节点", cdata: "nodeStr", style: "fakeA", action: "click", trigger: redirectTo_NodeTest},
          // {cname: "评估结论", cdata: "check_noteStr"},
          {cname: "评估结论", cdata: "check_noteStr", style:"fakeA", action:"click", trigger: redirectTo_Checknote},
          // {cname: "审核结果", cdata: "check_resultStr"},
          {cname: "审核结果", cdata: "check_resultStr", style:"fakeA", action:"click", trigger: redirectTo_CheckResult},
          {cname: "一级部门", cdata: "dep1_name"},
          {cname: "二级部门", cdata: "dep2_name"},
          {cname: "三级部门", cdata: "dep3_name"},
          {cname: "提交时间", cdata: "create_time"},
        ],
        managePageSize: true,
      };
      let tb = new LuyeTable(tbParam);

    });
  }

  componentDidMount() {

  }
}

