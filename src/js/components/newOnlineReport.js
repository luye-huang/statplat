/**
 * Created by yang on 17/4/19.
 */
/*
 上线准入报告

 修复比率=关闭数量/数量; 其结果根据配置管理中的阈值设置底色显示出不同的颜色（蓝色 绿色  黄色  红色）
 未有解决方案:其数量是指除rejected postpone 以及closed or close三个状态之外的状态。
 Total为0是是已解决，否则为未解决； 未解决的则为黄灯（底色显示黄色）


 */
import React, {Component} from "react";
import {
  Row, Col,
  Input, Button,
  Menu, Dropdown, Icon,
  Upload, message,
  NumericInput,
} from "antd";
import "../../less/newOnlineReport.less";
import {api} from "../api.js";
import {domain} from "../api.js";
import {dealUrl} from "../api.js";

let work_id,
  flag; //flag为0 隐藏 ,即display:none
var safeSta, //安全测试 状态
  weakSta, //弱网测试 状态
  testSta, //测试报告结论 状态
  UATSta; //UAT验收结论 状态
let safetest_filename,
  rwtest_filename,
  test_result_filename,
  uat_result_filename ;
export default class NewOnlineReport extends Component {
  //状态初始化 -- 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      dropData_safe: "蓝灯",
      dropData_weak: "NA",
      dropData_test: "通过",
      dropData_UAT: "通过",
      safetest_file:"",
      rwtest_file:"",
      test_result_file:"",
      uat_result_file:"",
    };
  }

  //下拉列表-事件处理 -- 安全测试
  menuOnclick_safe(e) {
    console.log('click', e.key);
    this.setState({
      dropData_safe: e.key,
    });
  }

  //下拉列表-事件处理 -- #弱网测试总结
  menuOnclick_weak(e) {
    console.log('click', e.key);
    this.setState({
      dropData_weak: e.key,
    });
  }

  //下拉列表-事件处理 -- 测试报告结论
  menuOnclick_test(e) {
    console.log('click', e.key);
    this.setState({
      dropData_test: e.key,
    });
  }

  //下拉列表-事件处理 -- UAT验收结论
  menuOnclick_UAT(e) {
    console.log('click', e.key);
    this.setState({
      dropData_UAT: e.key,
    });
  }

  //输入框 的onChange事件监听
  handleChange(e){
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
    console.log(this.state);
  }

  // 数量total/关闭数量total/比率/修复比率的onClick事件
  handleClick_Rate(e){
    let obj = {};
    switch(e.target.name){
      //tl数量total 的onClick事件
      case "tl_num_total":
        if(this.state.tl_num_1 === null || this.state.tl_num_2 === null || this.state.tl_num_3 === null || this.state.tl_num_4 === null ||
          this.state.tl_num_1 === "" || this.state.tl_num_2 === "" || this.state.tl_num_3 === "" || this.state.tl_num_4 === ""
        ){
          message.error("请输入pass Fail Block NoRun的数量");
        }else{
          obj[e.target.name] = parseInt(this.state.tl_num_1)+parseInt(this.state.tl_num_2)+parseInt(this.state.tl_num_3)+parseInt(this.state.tl_num_4);
          this.setState(obj);
        }
        break;
      // tl比率 的onClick事件
      case "tl_rate_1":
        if(this.state.tl_num_total == 0){
          obj[e.target.name] = 0;
          this.setState(obj);
        }else{
          if(this.state.tl_num_1 === null || this.state.tl_num_total === null ||
            this.state.tl_num_1 === "" || this.state.tl_num_total === ""
          ){
            message.error("请输入pass和Total数量");
          }else{
            obj[e.target.name] = (parseFloat(this.state.tl_num_1/this.state.tl_num_total)).toFixed(2);
            this.setState(obj);
            // console.log(this.state);
          }
        }
        break;
      case "tl_rate_2":
        if(this.state.tl_num_total == 0){
          obj[e.target.name] = 0;
          this.setState(obj);
        }else{
          if(this.state.tl_num_2 === null || this.state.tl_num_total === null ||
            this.state.tl_num_2 === "" || this.state.tl_num_total === ""
          ){
            message.error("请输入Fail和Total数量");
          }else{
            obj[e.target.name] = (parseFloat(this.state.tl_num_2/this.state.tl_num_total)).toFixed(2);
            this.setState(obj);
          }
        }
        break;
      case "tl_rate_3":
        if(this.state.tl_num_total == 0){
          obj[e.target.name] = 0;
          this.setState(obj);
        }else{
          if(this.state.tl_num_3 === null || this.state.tl_num_total === null ||
            this.state.tl_num_3 === "" || this.state.tl_num_total === ""
          ){
            message.error("请输入Block和Total数量");
          }else{
            obj[e.target.name] = (parseFloat(this.state.tl_num_3/this.state.tl_num_total)).toFixed(2);
            this.setState(obj);
          }
        }
        break;
      case "tl_rate_4":
        if(this.state.tl_num_total == 0){
          obj[e.target.name] = 0;
          this.setState(obj);
        }else{
          if(this.state.tl_num_4 === null || this.state.tl_num_total === null ||
            this.state.tl_num_4 === "" || this.state.tl_num_total === ""
          ){
            message.error("请输入NoRun和Total数量");
          }else{
            obj[e.target.name] = (parseFloat(this.state.tl_num_4/this.state.tl_num_total)).toFixed(2);
            this.setState(obj);
          }
        }
        break;
      case "tl_rate_total":
        if(this.state.tl_num_total == 0){
          obj[e.target.name] = 0;
          this.setState(obj);
        }else{
          if(this.state.tl_num_total === null ||
            this.state.tl_num_total === ""
          ){
            message.error("请输入Total数量");
          }else{
            obj[e.target.name] = (parseFloat(this.state.tl_num_total/this.state.tl_num_total)).toFixed(2);
            this.setState(obj);
          }
        }
        break;
      //jira 数量total 的onClick事件
      case "jira_num_total":
        if(this.state.jira_num_1 === null || this.state.jira_num_2 === null || this.state.jira_num_3 === null || this.state.jira_num_4 === null ||
          this.state.jira_num_1 === "" || this.state.jira_num_2 === "" || this.state.jira_num_3 === "" || this.state.jira_num_4 === ""
        ){
          message.error("请输入Block Critical Major Minor的数量");
        }else{
          obj[e.target.name] = parseInt(this.state.jira_num_1)+parseInt(this.state.jira_num_2)+parseInt(this.state.jira_num_3)+parseInt(this.state.jira_num_4);
          this.setState(obj);
        }
        break;
      //jira 关闭数量total 的onClick事件
      case "jira_close_num_total":
        if(this.state.jira_close_num_1 === null || this.state.jira_close_num_2 === null || this.state.jira_close_num_3 === null || this.state.jira_close_num_4 === null ||
          this.state.jira_close_num_1 === "" || this.state.jira_close_num_2 === "" || this.state.jira_close_num_3 === "" || this.state.jira_close_num_4 === ""
        ){
          message.error("请输入Block Critical Major Minor的关闭数量");
        }else{

          obj[e.target.name] = parseInt(this.state.jira_close_num_1)+parseInt(this.state.jira_close_num_2)+
            parseInt(this.state.jira_close_num_3)+parseInt(this.state.jira_close_num_4);
          this.setState(obj);
        }
        break;
      // jira修复比率 的onClick事件
      case "jira_repair_rate_1":
        if(this.state.jira_close_num_1 === null || this.state.jira_num_1 === null ||
          this.state.jira_close_num_1 === "" || this.state.jira_num_1 === ""
        ){
          message.error("请输入Block的数量和关闭数量");
        }else{
          if(this.state.jira_close_num_1 == 0 && this.state.jira_num_1 == 0){
            obj[e.target.name] = 0;
          }else{
            if(this.state.jira_close_num_1 > this.state.jira_num_1){
              message.error("Block关闭数量不合理");
              obj[e.target.name] = ""; //置空
            }else{
              obj[e.target.name] = (parseFloat(this.state.jira_close_num_1/this.state.jira_num_1)).toFixed(2);
            }
          }
          this.setState(obj);
        }
        break;
      case "jira_repair_rate_2":
        if(this.state.jira_close_num_2 === null || this.state.jira_num_2 === null ||
          this.state.jira_close_num_2 === "" || this.state.jira_num_2 === ""
        ){
          message.error("请输入Critical的数量和关闭数量");
        }else{
          if(this.state.jira_close_num_2 == 0 && this.state.jira_num_2 == 0){
            obj[e.target.name] = 0;
          }else{
            if(this.state.jira_close_num_2 > this.state.jira_num_2){
              message.error("Critical关闭数量不合理");
              obj[e.target.name] = ""; //置空
            }else{
              obj[e.target.name] = (parseFloat(this.state.jira_close_num_2/this.state.jira_num_2)).toFixed(2);
            }
          }
          this.setState(obj);
        }
        break;
      case "jira_repair_rate_3":
        if(this.state.jira_close_num_3 === null || this.state.jira_num_3 === null ||
          this.state.jira_close_num_3 === "" || this.state.jira_num_3 === ""
        ){
          message.error("请输入Major的数量和关闭数量");
        }else{
          if(this.state.jira_close_num_3 == 0 && this.state.jira_num_3 == 0){
            obj[e.target.name] = 0;
          }else{
            if(this.state.jira_close_num_3 > this.state.jira_num_3){
              message.error("Major关闭数量不合理");
              obj[e.target.name] = ""; //置空
            }else{
              obj[e.target.name] = (parseFloat(this.state.jira_close_num_3/this.state.jira_num_3)).toFixed(2);
            }
          }
          this.setState(obj);
        }
        break;
      case "jira_repair_rate_4":
        if(this.state.jira_close_num_4 === null || this.state.jira_num_4 === null ||
          this.state.jira_close_num_4 === "" || this.state.jira_num_4 === ""
        ){
          message.error("请输入Minor的数量和关闭数量");
        }else{
          if(this.state.jira_close_num_4 == 0 && this.state.jira_num_4 == 0){
            obj[e.target.name] = 0;
          }else{
            if(this.state.jira_close_num_4 > this.state.jira_num_4){
              message.error("Minor关闭数量不合理");
              obj[e.target.name] = ""; //置空
            }else{
              obj[e.target.name] = (parseFloat(this.state.jira_close_num_4/this.state.jira_num_4)).toFixed(2);
            }
          }
          this.setState(obj);
        }
        break;
      case "jira_repair_rate_total":
        if(this.state.jira_close_num_total === null || this.state.jira_num_total === null ||
          this.state.jira_close_num_total === "" || this.state.jira_num_total === ""
        ){
          message.error("请输入Total数量和关闭数量");
        }else{
          if(this.state.jira_close_num_total == 0 && this.state.jira_num_total == 0){
            obj[e.target.name] = 0;
          }else{
            if(this.state.jira_close_num_total > this.state.jira_num_total){
              message.error("Total关闭数量不合理");
              obj[e.target.name] = ""; //置空
            }else{
              obj[e.target.name] = (parseFloat(this.state.jira_close_num_total/this.state.jira_num_total)).toFixed(2);
            }
          }
          this.setState(obj);
        }
        break;
      //未有解决方案total 的onClick事件
      case "jira_notfinish_num_total":
        if(this.state.jira_notfinish_num_1 === null || this.state.jira_notfinish_num_2 === null || this.state.jira_notfinish_num_3 === null || this.state.jira_notfinish_num_4 === null ||
          this.state.jira_notfinish_num_1 === "" || this.state.jira_notfinish_num_2 === "" || this.state.jira_notfinish_num_3 === "" || this.state.jira_notfinish_num_4 === ""
        ){
          message.error("请输入pass Fail Block NoRun的未有解决方案个数");
        }else{
          obj[e.target.name] = parseInt(this.state.jira_notfinish_num_1)+parseInt(this.state.jira_notfinish_num_2)+parseInt(this.state.jira_notfinish_num_3)+parseInt(this.state.jira_notfinish_num_4);
          this.setState(obj);
        }
        break;
      default:
        break;
    }
  }


  render() {
    //从准入报告列表页,解析传过来的url中的work_id参数
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    console.log(work_id);
    flag = obj["flag"];
    console.log(flag);
    
    //下拉菜单 - menu - 安全测试
    const dropData_safe = ["蓝灯", "绿灯", "黄灯", "红灯"];
    const dropMenu_safe = (
      <Menu onClick={this.menuOnclick_safe.bind(this)}>
        <Menu.Item key={dropData_safe[0]}>
          <p>{dropData_safe[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_safe[1]}>
          <p>{dropData_safe[1]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_safe[2]}>
          <p>{dropData_safe[2]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_safe[3]}>
          <p>{dropData_safe[3]}</p>
        </Menu.Item>
      </Menu>
    );
    //下拉菜单 - menu - #弱网测试总结
    const dropData_weak = ["NA", "通过", "未通过"];
    const dropMenu_weak = (
      <Menu onClick={this.menuOnclick_weak.bind(this)}>
        <Menu.Item key={dropData_weak[0]}>
          <p>{dropData_weak[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_weak[1]}>
          <p>{dropData_weak[1]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_weak[2]}>
          <p>{dropData_weak[2]}</p>
        </Menu.Item>
      </Menu>
    );
    //下拉菜单 - menu - 测试报告结论
    const dropData_test = ["通过", "未通过"];
    const dropMenu_test = (
      <Menu onClick={this.menuOnclick_test.bind(this)}>
        <Menu.Item key={dropData_test[0]}>
          <p>{dropData_test[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_test[1]}>
          <p>{dropData_test[1]}</p>
        </Menu.Item>
      </Menu>
    );
    //下拉菜单 - menu - UAT验收结论
    const dropData_UAT = ["通过", "未通过"];
    const dropMenu_UAT = (
      <Menu onClick={this.menuOnclick_UAT.bind(this)}>
        <Menu.Item key={dropData_UAT[0]}>
          <p>{dropData_UAT[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_UAT[1]}>
          <p>{dropData_UAT[1]}</p>
        </Menu.Item>
      </Menu>
    );
    //文件上传
    const props1 = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          safetest_filename = info.fileList[0].response.data.filename;
          console.log(safetest_filename);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const props2 = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          rwtest_filename = info.fileList[0].response.data.filename;
          console.log(rwtest_filename);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const props3 = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          test_result_filename = info.fileList[0].response.data.filename;
          console.log(test_result_filename);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const props4 = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          uat_result_filename = info.fileList[0].response.data.filename;
          console.log(uat_result_filename);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={11}></Col>
          <Col span={6} className="title-txt">上线准入报告</Col>
        </Row>
        <div>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              Testlink入参
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入测试计划名称" name="tl_id" value={this.state.tl_id}
                     onChange={this.handleChange.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result border-right-css">
              测试用例结果分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>状态</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Pass</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Fail</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Block</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>NoRun</span></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <span>Total</span></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="1" name="tl_num_1" value={this.state.tl_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="2" name="tl_num_2" value={this.state.tl_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_3" value={this.state.tl_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_4" value={this.state.tl_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_total" value={this.state.tl_num_total} onClick={this.handleClick_Rate.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="2" name="tl_rate_1" value={this.state.tl_rate_1} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_2" value={this.state.tl_rate_2} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_3" value={this.state.tl_rate_3} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_4" value={this.state.tl_rate_4} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail">
                  <Input type="number" placeholder="" name="tl_rate_total" value={this.state.tl_rate_total} onClick={this.handleClick_Rate.bind(this)}/></Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="jira-css">
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              JIRA入参
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="摘要中需求名称" name="jira_id" value={this.state.jira_id}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result bug-analyse-css border-right-css">
              BUG分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>严重级别</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Block</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Critical</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Major</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Minor</span></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <span>Total</span></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="2" name="jira_num_1" value={this.state.jira_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="3" name="jira_num_2" value={this.state.jira_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_num_3" value={this.state.jira_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_num_4" value={this.state.jira_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_num_total" value={this.state.jira_num_total} onClick={this.handleClick_Rate.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>关闭数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="1" name="jira_close_num_1" value={this.state.jira_close_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="2" name="jira_close_num_2" value={this.state.jira_close_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_close_num_3" value={this.state.jira_close_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_close_num_4" value={this.state.jira_close_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_close_num_total" value={this.state.jira_close_num_total} onClick={this.handleClick_Rate.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>修复比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="2" name="jira_repair_rate_1" value={this.state.jira_repair_rate_1} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_2" value={this.state.jira_repair_rate_2} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_3" value={this.state.jira_repair_rate_3} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_4" value={this.state.jira_repair_rate_4} onClick={this.handleClick_Rate.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_total" value={this.state.jira_repair_rate_total} onClick={this.handleClick_Rate.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>未有解决方案</span></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="2" name="jira_notfinish_num_1" value={this.state.jira_notfinish_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="jira_notfinish_num_2" value={this.state.jira_notfinish_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="jira_notfinish_num_3" value={this.state.jira_notfinish_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="jira_notfinish_num_4" value={this.state.jira_notfinish_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail">
                  <Input type="number" placeholder="" name="jira_notfinish_num_total" value={this.state.jira_notfinish_num_total} onClick={this.handleClick_Rate.bind(this)}/></Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="jira-css">
            <Col span={6} className="test-result border-right-css border-bottom-css">
              兼容性测试结果
            </Col>
            <Col span={18}>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">需要测试的机型/浏览器</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input placeholder="" name="cptest_need" value={this.state.cptest_need} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">实际测试的机型/浏览器</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input placeholder="" name="cptest_final" value={this.state.cptest_final} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">百分率</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input placeholder="" name="cptest_rate" value={this.state.cptest_rate} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">安全测试</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2} className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
              style={{  }}
            >
              <div>
                <Dropdown overlay={dropMenu_safe} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_safe}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-result-detail border-bottom-css">
              <Upload {...props1}>
                <Button>
                  <Icon type="upload" /> 安全测试截图
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">#弱网测试总结</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2} className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
                 style={{  }}
            >
              <div>
                <Dropdown overlay={dropMenu_weak} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_weak}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-result-detail border-bottom-css">
              <Upload {...props2}>
                <Button>
                  <Icon type="upload" /> 弱网测试总结截图
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">测试报告结论</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2} className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
              style={{ backgroundColor:(this.state.dropData_test=="未通过" ? "red" : (this.state.dropData_test=="通过"?"green":"white")) }}
            >
              <div>
                <Dropdown overlay={dropMenu_test} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_test}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-result-detail border-bottom-css">
              <Upload {...props3}>
                <Button>
                  <Icon type="upload" /> 测试报告结论截图
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css">UAT验收结论</Col>
            <Col span={8} className="test-result-detail border-right-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2} className="test-result-detail dropdown-list-css border-right-css"
              style={{ backgroundColor:(this.state.dropData_UAT=="未通过" ? "red" : (this.state.dropData_UAT=="通过"?"green":"white")) }}
            >
              <div>
                <Dropdown overlay={dropMenu_UAT} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_UAT}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-result-detail">
              <Upload {...props4}>
                <Button>
                  <Icon type="upload" /> UAT验收结论截图
                </Button>
              </Upload>
            </Col>
          </Row>
        </div>

        <div style={{ display:(flag==0?"none":"block") }}>
          <Row className="jira-css row-btn-css">
            <Col span={12} className="look-result-btn">
              <Button style={{ display:"none"}}
                onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=0&pageTag=online" }}
              >查看结果</Button>
            </Col>
            <Col span={24} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{ 
                        //提交 上线报告信息
                        this.getIntFromString();
                        //文件上传
                        this.state.safetest_file = (safetest_filename==undefined)?"":safetest_filename;
                        this.state.rwtest_file = (rwtest_filename==undefined)?"":rwtest_filename;
                        this.state.test_result_file = (test_result_filename==undefined)?"":test_result_filename;
                        this.state.uat_result_file = (uat_result_filename==undefined)?"":uat_result_filename;
                        console.log(this.state);
                        // debugger;
                        api.postOnlineReport(this.state).then(data=>{
                          console.log(data);
                          if(data.status == 200){
                            console.log("online report post success");
                            window.location.href="index.html#/evaluationResult?flag=1&pageTag=online&work_id="+ work_id
                          }else if(data.status == 500){
                            console.log(data.message);
                            alert(data.message);
                          }
                        });

                        } }
              >提交</Button>
            </Col>
          </Row>
        </div>

      </div>
    );
  }

  getIntFromString(){
    //安全测试
    if(this.state.dropData_safe == "未选择"){
      this.state.safetest_status = 0;
    }
    else if(this.state.dropData_safe == "蓝灯"){
      this.state.safetest_status = 1;
    }else if(this.state.dropData_safe == "绿灯"){
      this.state.safetest_status = 2;
    }else if(this.state.dropData_safe == "黄灯"){
      this.state.safetest_status = 3;
    }else if(this.state.dropData_safe == "红灯"){
      this.state.safetest_status = 4;
    }
    //弱网测试总结  -- 待定
    if(this.state.dropData_weak == "NA"){
      this.state.rwtest_status = 0
    }else if(this.state.dropData_weak == "通过"){
      this.state.rwtest_status = 1
    }else if(this.state.dropData_weak == "未通过"){
      this.state.rwtest_status = 0
    }
    //测试报告结论
    if(this.state.dropData_test == "通过"){
      this.state.test_result = 1
    }else if(this.state.dropData_test == "未通过"){
      this.state.test_result = 0
    }
    //UAT验收结论
    if(this.state.dropData_UAT == "通过"){
      this.state.uat_result = 1
    }else if(this.state.dropData_UAT == "未通过"){
      this.state.uat_result = 0
    }
  }

  componentDidMount() {
    //新建上线报告前,获取上线的jira数据
    api.getOnlineReport_Jira(work_id).then(data=> {
      console.log("online report get jira success");
      console.log(data);
      console.log(work_id);
      //将数据显示在页面上
      this.state = data.data;
      /*
        将int类型的状态数据,转换成对应的字符串类型
      */
      //安全测试 状态
      safeSta = this.state.safetest_status;
      if(safeSta == 1){
        this.setState({dropData_safe:"蓝灯"});
      }else if(safeSta ==2){
        this.setState({dropData_safe:"绿灯"});
      }else if(safeSta ==3){
        this.setState({dropData_safe:"黄灯"});
      }else if(safeSta ==4){
        this.setState({dropData_safe:"红灯"});
      }else{
        this.setState({dropData_safe:"未选择"});
      }
      //弱网测试 状态
      weakSta = this.state.rwtest_status;
      if( weakSta == 1 ){
        this.setState({ dropData_weak:"通过" });
      }else if( weakSta == 2 ){  // --- 还需验证"弱网测试"的字段设计,接口中设计的有问题 - 2017.04.26
        this.setState({ dropData_weak:"NA" });
      }else{
        this.setState({ dropData_weak:"未通过" });
      }
      //测试报告结论 状态
      testSta = this.state.test_result;
      //UAT验收结论 状态
      UATSta = this.state.uat_result;
      this.setState({
        dropData_test:(testSta == 1)?"通过":"未通过" ,
        dropData_UAT:(UATSta == 1)?"通过":"未通过",
        work_id:work_id,
      });
      console.log(this.state);
    });
  }
}