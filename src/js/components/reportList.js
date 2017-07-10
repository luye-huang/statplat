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
import DptList from './dptList';
import LuyeTable from "./luyeTable/luyeTable.js";

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
let work_id;
let check_result; //审核结果
var reportListState;
export default class ReportList extends Component {
  //状态初始化 -- input输入框 和 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      name: "",
      reporter_ctx: "",
      date_begin: "2017-04-18",
      date_end: currTime,
      deps: null,
      dep1_list: [],
      dep2_list: [],
      dep3_list: [],
      dep1_id: "",
      dep2_id: "",
      dep3_id: '',
      dep3_name: "",
      selected1: '',
      selected2: '',
      selected3: '',
      dropData: "全部",
      checkinModal: false,
      onlineModal: false,
      mergeModal: false,
      isLoaded: false
    };

  }

  componentWillMount() {
    api.getDepartment().then((data)=> {
      console.log(data);
      this.deps = data.data;
      this.setState({
        isLoaded: true,
        dep1_list: data.data.dp1,
        deps: data.data
      });
    })
  }

  //时间日期选择  -- 提交时间事件处理
  onChange(date, dateString) {
    //更改提交时间的状态
    this.setState({
      date_begin: dateString[0],
      date_end: dateString[1],
    });
  }

  //下拉列表-事件处理
  menuOnclick(e) {
    this.setState({
      dropData: e.key,
    });
  }

  //输入框 -- onChange事件处理
  handleChange(e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
    
    this.state.dep2_name = Math.random() * 100;
    this.state.dep1_overlay = (<div>{[2, 3, 5, 5].map(function (item) {
      <div>{item}</div>
    })}</div>);
  }

  //提测对话框
  checkinModalOK() {
    //保存当前的状态(准入报告页面的查询条件)到localStorage中
    this.saveReportListStateToLocal();

    //跳转到 -- 新建提测报告页面,并将work_id传过去
    window.location = "index.html#/newCheckInReport?work_id=" + work_id;
    this.setState({
      checkinModal: false,
    });
  }

  checkinModalCancel() {
    this.setState({
      checkinModal: false, //关闭对话框
    });
  }

  //上线对话框
  onlineModalOK() {
    //保存当前的状态(准入报告页面的查询条件)到localStorage中
    this.saveReportListStateToLocal();

    //跳转到 -- 新建上线报告的页面,传递work_id
    window.location = "index.html#/newOnlineReport?work_id=" + work_id;
    this.setState({
      onlineModal: false,
    });
  }

  onlineModalCancel() {
    this.setState({
      onlineModal: false, //关闭对话框
    });
  }

  //合板对话框
  mergeModalOK() {
    //保存当前的状态(准入报告页面的查询条件)到localStorage中
    this.saveReportListStateToLocal();

    //跳转到 -- 新建合板报告的页面,传递work_id
    window.location = "index.html#/newMergeReport?work_id=" + work_id;
    this.setState({
      mergeModal: false,
    });
  }

  mergeModalCancel() {
    this.setState({
      mergeModal: false, //关闭对话框
    });
  }

  changeSubDep(e) {
    console.log(e);
    //pid is the id needed for ajax request
    const [id, depSelected, layer] = e.key.split('@');
    if (layer === '1') {
      const list = this.state.deps.dp2.filter((item)=>item.parent_id == parseInt(id))
      this.setState({
        dep2_list: list,
        dep3_list: [],
        selected1: depSelected,
        selected2: '',
        selected3: '',
        dep1_id: id
      });
    }
    else if (layer === '2') {
      const list = this.state.deps.dp3.filter((item)=>item.parent_id == parseInt(id))
      this.setState({dep3_list: list, selected2: depSelected, selected3: '', dep2_id: id});
    }
    else if (layer === '3') {
      this.setState({selected3: depSelected, dep3_id: id});
    }
  }

  //查 询 -按钮点击事件
  clickBtn(){
    this.getTbData();
  }

  render() {
    //下拉菜单 - menu
    const dropData = ["全部", "通过", "未通过", "待审核"];
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

    return this.state.isLoaded ? (
      <div>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="需求名称" defaultValue={this.state.name} name="name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="报告人ctx" defaultValue={this.state.reporter_ctx} name="reporter_ctx"
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
          <Col span={6} className="exam-result">
            <span>一级部门</span>
            <DptList list={this.state.dep1_list} changeSubDep={this.changeSubDep.bind(this)} layer={1}
                     selected={this.state.selected1}/>
          </Col>
          <Col span={6} className="exam-result">
            <span>二级部门</span>
            <DptList list={this.state.dep2_list} changeSubDep={this.changeSubDep.bind(this)} layer={2}
                     selected={this.state.selected2}/>
          </Col>
          <Col span={6} className="exam-result">
            <span>三级部门</span>
            <DptList list={this.state.dep3_list} changeSubDep={this.changeSubDep.bind(this)} layer={3}
                     selected={this.state.selected3}/>
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
                                onClick={()=>{
                                  //保存当前的状态(准入报告页面的查询条件)到localStorage中
                                  this.saveReportListStateToLocal();
                                  window.location = 'index.html#/newProject';
                                }}>新建项目</Button></Col>
          <Col span={6}><Button style={{marginLeft: 4}} type="primary"
                                onClick={
                                  this.clickBtn.bind(this)
                                /*()=> {
                                  this.getTbData();
                                } */
                                }
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
    ) : null;
  }

  getTbData() {
    //审核结果 字符串解析成int型
    if (this.state.dropData == "全部") {
      check_result = -1;
    } else if (this.state.dropData == "待审核") {
      check_result = 0;
    } else if (this.state.dropData == "通过") {
      check_result = 1;
    } else if (this.state.dropData == "未通过") {
      check_result = 2;
    }
    this.state.check_result = check_result;
    //调用接口函数
    api.getReportList(this.state).then(data => {
      console.log(data);
      let arr = data.data;
      let typeStr = "", nodeStr = "",
        check_noteStr = "", check_resultStr = "",
        _nUrl = "";
      let nodeUrl = "index.html#/@@";
      for (let i = 0; i < arr.length; i++) {
        let nodeHistory1 = "";
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
          //查看历史报告的节点
          nodeHistory1 = "提测";
        } else if (arr[i].node == 4 || arr[i].node == 5) {
          nodeStr = "合版";
          _nUrl = "newMergeReport";
          nodeHistory1 = "提测";
        }
        arr[i]["nodeStr"] = nodeStr;
        arr[i]["_nUrl"] = _nUrl;
        arr[i]["nodeHistory1"] = nodeHistory1;
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
      
      //节点的跳转
      const redirectTo_NodeTest = (e)=> {
        //取到对应的工作流id
        work_id = e.data.id;
        //提测报告
        if (Object.is(e.data.node, 0)) {
          this.setState({checkinModal: true}); //显示提测对话框
        }
        else if (Object.is(e.data.node, 1)) {
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/newCheckInReport?work_id=" + work_id;
        }
        //上线报告
        else if (Object.is(e.data.node, 2)) {
          this.setState({onlineModal: true}); //显示上线对话框
        }
        else if (Object.is(e.data.node, 3)) {
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/newOnlineReport?work_id=" + work_id;
        }
        //合板报告
        else if (Object.is(e.data.node, 4)) {
          this.setState({mergeModal: true}); //显示合板对话框
        }
        else if (Object.is(e.data.node, 5)) {
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/newMergeReport?work_id=" + work_id;
        }
      }
      //评估结论的跳转  -- 跳转到evaluationResult评估结论页面, pageTag=checkin
      const redirectTo_Checknote = (e)=> {
        work_id = e.data.id;
        if (Object.is(e.data.node, 0)) {
          this.setState({checkinModal: true}); //显示提测对话框
        }
        else if (Object.is(e.data.node, 1)) { //跳转到提测的评估页面
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=checkin";
        }
        else if (Object.is(e.data.node, 2)) {
          this.setState({onlineModal: true}); //显示上线对话框
        }
        else if (Object.is(e.data.node, 3)) { //跳转到上线的评估页面
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=online";
        }
        else if (Object.is(e.data.node, 4)) {
          this.setState({mergeModal: true}); //显示合板对话框
        }
        else if (Object.is(e.data.node, 5)) { //跳转到合板的评估页面
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/evaluationResult?work_id=" + work_id + "&pageTag=merge";
        }
      }
      //审核结果的跳转 -- 跳转到examResult审核结果页面,
      const redirectTo_CheckResult = (e)=> {
        work_id = e.data.id;
        if (Object.is(e.data.node, 0)) {
          this.setState({checkinModal: true}); //显示提测对话框
        }
        else if (Object.is(e.data.node, 1)) { //跳转到提测的审核页面
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=checkin";
        }
        else if (Object.is(e.data.node, 2)) {
          this.setState({onlineModal: true}); //显示上线对话框
        }
        else if (Object.is(e.data.node, 3)) { //跳转到上线的审核页面
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=online";
        }
        else if (Object.is(e.data.node, 4)) {
          this.setState({mergeModal: true}); //显示合板对话框
        }
        else if (Object.is(e.data.node, 5)) { //跳转到合板的审核页面
          //保存当前的状态(准入报告页面的查询条件)到localStorage中
          this.saveReportListStateToLocal();
          window.location.href = "index.html#/examResult?work_id=" + work_id + "&pageTag=merge";
        }
      }
      //查看历史报告
      const redirectTo_CheckinReportHistory = (e)=> {
        work_id = e.data.id;
        //保存当前的状态(准入报告页面的查询条件)到localStorage中
        this.saveReportListStateToLocal();
        window.location.href = "index.html#/checkinReportHistoryPage?work_id=" + work_id;

      }
      //查看项目信息
      const redirectTo_ReportInfo = (e)=> {
        work_id = e.data.id;
        let node = e.data.node;
        window.location.href = "index.html#/viewReportInfo?work_id=" + work_id + "&node=" + node;
        //跳转到"查看项目信息页面"时,保存当前的状态(准入报告页面的查询条件)到localStorage中
        this.saveReportListStateToLocal();
      }

      const editRow = function () {
        console.log(1);
      }
      const deleteRow = (e)=> {
        console.log(this);
      }

      const addRow = (a)=> {
        console.log(a);
        console.log(this);
      }

      const handlerDelete = (arg)=>{
        console.log(arg);
      };
      const handlerEdit = (arg)=>{
        console.log(arg);
      };

      //表格数据渲染
      var tbParam = {
        el: $("#tb-div"),
        data: arr,
        columns: [{cname: "报告ID", cdata: "id"},
          {cname: "需求名称", cdata: "name", style: "fakeA", action: "click", trigger: redirectTo_ReportInfo},
          {cname: "需求ID", cdata: "jira_id"},
          {cname: "项目类型", cdata: "typeStr"},
          {cname: "报告人ctx", cdata: "tester_ctx"},
          // {cname:"节点",cdata:"nodeStr",type:"a", url:nodeUrl, params:["_nUrl"]},
          {cname: "节点", cdata: "nodeStr", style: "fakeA", action: "click", trigger: redirectTo_NodeTest},
          // {cname: "评估结论", cdata: "check_noteStr"},
          {cname: "评估结论", cdata: "check_noteStr", style: "fakeA", action: "click", trigger: redirectTo_Checknote},
          // {cname: "审核结果", cdata: "check_resultStr"},
          {cname: "审核结果", cdata: "check_resultStr", style: "fakeA", action: "click", trigger: redirectTo_CheckResult},
          {cname: "一级部门", cdata: "dep1_name"},
          {cname: "二级部门", cdata: "dep2_name"},
          {cname: "三级部门", cdata: "dep3_name"},
          {cname: "提交时间", cdata: "create_time"},
          {
            cname: "查看历史报告",
            cdata: "nodeHistory1",
            style: "fakeA",
            action: "click",
            trigger: redirectTo_CheckinReportHistory
          },
          // {
          //   cname: '管理',
          //   type: 'btns',
          //   handlers: [{btnText: '查看', handler: addRow}, {btnText: '编辑', handler: editRow}, {btnText: '删除', handler: deleteRow}]
          // },
          /*{
            cname: '管理',
            type: 'management'

          }*/
        ],
        managePageSize: true,
        handlerEdit: handlerEdit,
        handlerDelete: handlerDelete
      };
      let tb = new LuyeTable(tbParam);

    });
  }

  //保存当前的状态(准入报告页面的查询条件)到localStorage中
  saveReportListStateToLocal(){
    const {name, reporter_ctx, date_begin, date_end, selected1, selected2, selected3, dropData, dep1_id, dep2_id, dep3_id} = this.state;
    reportListState = {
      name:name,
      reporter_ctx:reporter_ctx,
      date_begin:date_begin,
      date_end:date_end,
      selected1:selected1,
      selected2:selected2,
      selected3:selected3,
      dropData:dropData,
      dep1_id:dep1_id, //部门id
      dep2_id:dep2_id,
      dep3_id:dep3_id,
    }
    localStorage.setItem("reportListState",JSON.stringify(reportListState));
  }

  componentDidMount() {
    //回到本页面时,将保存的状态(准入报告页面的查询条件)显示在页面上,并渲染数据,同时清空localStorage中的reportListState状态
    if(localStorage.getItem("reportListState")!=null && localStorage.getItem("reportListState")!=""){
      reportListState = JSON.parse(localStorage.getItem("reportListState"));
      console.log(reportListState);
      this.setState(reportListState); //此时this.state的状态还没有改变--
      //
      this.state.name = reportListState.name;
      this.state.reporter_ctx = reportListState.reporter_ctx;
      this.state.date_begin = reportListState.date_begin;
      this.state.date_end = reportListState.date_end;
      this.state.selected1 = reportListState.selected1;
      this.state.selected2 = reportListState.selected2;
      this.state.selected3 = reportListState.selected3;
      this.state.dropData = reportListState.dropData;
      this.state.dep1_id = reportListState.dep1_id;
      this.state.dep2_id = reportListState.dep2_id;
      this.state.dep3_id = reportListState.dep3_id;
      //
      this.state.isLoaded = true; // --

      this.clickBtn();
      localStorage.setItem("reportListState",""); //本地缓存中,准入报告保存的状态 - 置空
    }
  }
}

