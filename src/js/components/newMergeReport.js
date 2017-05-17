/**
 * Created by yang on 17/4/20.
 */

/*
 合板准入报告


 */
import React, {Component} from "react";
import {
  Row, Col,
  Input, Button,
  Menu, Dropdown, Icon,
  Upload, message,
} from "antd";
import {api} from "../api.js";
import {domain} from "../api.js";
import {dealUrl} from "../api.js";

var objData = {};
var work_id,
    flag; //flag为0 隐藏 ,即display:none
var safeSta, //安全测试 状态
  serviceSta, //相关服务已上线 状态
  mergeSta, //合版后需求无更新 状态
  testSta, //测试报告结论 状态
  UATSta; //UAT验收结论 状态
let safetest_filename,
  if_online_filename,
  test_result_filename,
  no_change_after_merge_filename,
  uat_result_filename;
export default class NewMergeReport extends Component {
  //状态初始化 -- 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      dropData_safe: "蓝灯",
      dropData_service: "未上线",
      dropData_merge:"无变更",
      dropData_test: "通过",
      dropData_UAT: "通过",
      safetest_file:"",
      if_online_file:"",
      test_result_file:"",
      no_change_after_merge_file:"",
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

  //下拉列表-事件处理 -- 相关服务已上线
  menuOnclick_service(e) {
    console.log('click', e.key);
    this.setState({
      dropData_service: e.key,
    });
  }

  //下拉列表-事件处理 -- 合版后需求无更新
  menuOnclick_merge(e) {
    console.log('click', e.key);
    this.setState({
      dropData_merge: e.key,
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
  handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
    this.state[e.target.name] = e.target.value;
    if (['tl_num_1', 'tl_num_2', 'tl_num_3', 'tl_num_4'].includes(e.target.name) && this.state.tl_num_4 != undefined && this.state.tl_num_1 != undefined && this.state.tl_num_2 != undefined && this.state.tl_num_3 != undefined) {
      const {tl_num_1, tl_num_2, tl_num_3, tl_num_4} = this.state;
      let tl_num_total = Number.parseInt(tl_num_1) + Number.parseInt(tl_num_2) + Number.parseInt(tl_num_3) + Number.parseInt(tl_num_4);
      //debugger
      const tl_rate_1 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_1) / tl_num_total).toFixed(2);
      const tl_rate_2 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_2) / tl_num_total).toFixed(2);
      const tl_rate_3 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_3) / tl_num_total).toFixed(2);
      const tl_rate_4 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_4) / tl_num_total).toFixed(2);
      const tl_rate_total = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_total) / tl_num_total).toFixed(2);
      tl_num_total = Number.isNaN(tl_num_total)? '': tl_num_total;
      this.setState({tl_num_total,tl_rate_1,tl_rate_2, tl_rate_3,tl_rate_4, tl_rate_total,});
    }
    //jira 参数
    if(['jira_num_1', 'jira_num_2', 'jira_num_3', 'jira_num_4'].includes(e.target.name)
      && this.state.jira_num_1 != undefined && this.state.jira_num_2 != undefined && this.state.jira_num_3 != undefined && this.state.jira_num_4 != undefined
    ){
      const {jira_num_1, jira_num_2, jira_num_3, jira_num_4, jira_close_num_1, jira_close_num_2, jira_close_num_3, jira_close_num_4,jira_close_num_total} = this.state;
      let jira_num_total = Number.parseInt(jira_num_1) + Number.parseInt(jira_num_2) + Number.parseInt(jira_num_3) + Number.parseInt(jira_num_4);
      let jira_repair_rate_1 = parseFloat(parseInt(jira_close_num_1) / parseInt(jira_num_1)).toFixed(2);
      let jira_repair_rate_2 = parseFloat(parseInt(jira_close_num_2) / parseInt(jira_num_2)).toFixed(2);
      let jira_repair_rate_3 = parseFloat(parseInt(jira_close_num_3) / parseInt(jira_num_3)).toFixed(2);
      let jira_repair_rate_4 = parseFloat(parseInt(jira_close_num_4) / parseInt(jira_num_4)).toFixed(2);
      let jira_repair_rate_total= parseFloat(parseInt(jira_close_num_total) / parseInt(jira_num_total)).toFixed(2);
      this.setState({jira_num_total,jira_repair_rate_1,jira_repair_rate_2,jira_repair_rate_3,jira_repair_rate_4, jira_repair_rate_total,});
    }

    if(['jira_close_num_1', 'jira_close_num_2', 'jira_close_num_3', 'jira_close_num_4'].includes(e.target.name)
      && this.state.jira_close_num_1 != undefined && this.state.jira_close_num_2 != undefined && this.state.jira_close_num_3 != undefined && this.state.jira_close_num_4 != undefined
    ){
      // debugger;
      const {jira_num_1, jira_num_2, jira_num_3, jira_num_4, jira_num_total, jira_close_num_1, jira_close_num_2, jira_close_num_3, jira_close_num_4} = this.state;
      let jira_close_num_total = Number.parseInt(jira_close_num_1)+Number.parseInt(jira_close_num_2)+Number.parseInt(jira_close_num_3)+Number.parseInt(jira_close_num_4);
      let jira_repair_rate_1,jira_repair_rate_2, jira_repair_rate_3,jira_repair_rate_4, jira_repair_rate_total;
      if (jira_close_num_1 === "" || jira_num_1 === "" || jira_close_num_1 === null || jira_num_1 === null) {
        jira_repair_rate_1 = "";
      } else {
        if (jira_close_num_1 == 0 && jira_num_1 == 0) {
          jira_repair_rate_1 = 0.00;
        } else {
          if (jira_close_num_1 > jira_num_1) {
            message.error("Block关闭数量不合理");
            jira_repair_rate_1 = "";
          } else {
            jira_repair_rate_1 = parseFloat(parseInt(jira_close_num_1) / parseInt(jira_num_1)).toFixed(2);
          }
        }
      }
      if (jira_close_num_2 === "" || jira_num_2 === "" || jira_close_num_2 === null || jira_num_2 === null) {
        jira_repair_rate_2 = "";
      } else {
        if (jira_close_num_2 == 0 && jira_num_2 == 0) {
          jira_repair_rate_2 = 0.00;
        } else {
          if (jira_close_num_2 > jira_num_2) {
            message.error("Critical关闭数量不合理");
            jira_repair_rate_2 = "";
          } else {
            jira_repair_rate_2 = parseFloat(parseInt(jira_close_num_2) / parseInt(jira_num_2)).toFixed(2);
          }
        }
      }
      if (jira_close_num_3 === "" || jira_num_3 === "" || jira_close_num_3 === null || jira_num_3 === null) {
        jira_repair_rate_3 = "";
      } else {
        if (jira_close_num_3 == 0 && jira_num_3 == 0) {
          jira_repair_rate_3 = 0.00;
        } else {
          if (jira_close_num_3 > jira_num_3) {
            message.error("Major关闭数量不合理");
            jira_repair_rate_3 = "";
          } else {
            jira_repair_rate_3 = parseFloat(parseInt(jira_close_num_3) / parseInt(jira_num_3)).toFixed(2);
          }
        }
      }
      if (jira_close_num_4 === "" || jira_num_4 === "" || jira_close_num_4 === null || jira_num_4 === null) {
        jira_repair_rate_4 = "";
      } else {
        if (jira_close_num_4 == 0 && jira_num_4 == 0) {
          jira_repair_rate_4 = 0.00;
        } else {
          if (jira_close_num_4 > jira_num_4) {
            message.error("Minor关闭数量不合理");
            jira_repair_rate_4 = "";
          } else {
            jira_repair_rate_4 = parseFloat(parseInt(jira_close_num_4) / parseInt(jira_num_4)).toFixed(2);
          }
        }
      }
      if (jira_close_num_total === "" || jira_num_total === "" || jira_close_num_total === null || jira_num_total === null) {
        jira_repair_rate_total = "";
      } else {
        if (jira_close_num_total == 0 && jira_num_total == 0) {
          jira_repair_rate_total = 0.00;
        } else {
          if (jira_close_num_total > jira_num_total) {
            message.error("Total关闭数量不合理");
            jira_repair_rate_total = "";
          } else {
            jira_repair_rate_total = parseFloat(parseInt(jira_close_num_total) / parseInt(jira_num_total)).toFixed(2);
          }
        }
      }
      this.setState({jira_close_num_total,jira_repair_rate_1, jira_repair_rate_2, jira_repair_rate_3,jira_repair_rate_4, jira_repair_rate_total,});
    }
    //兼容性测试结果
    // cptest_need cptest_final cptest_rate
    if(["cptest_need","cptest_final"].includes(e.target.name) && this.state.cptest_need!=undefined && this.state.cptest_final!=undefined){
      const {cptest_need, cptest_final} = this.state;
      let cptest_rate;
      if(parseInt(cptest_final) > parseInt(cptest_need)){
        message.error("实际测试>需要测试 的浏览器个数,不合理");
      }else{
        cptest_rate = parseFloat( parseInt(cptest_final)/parseInt(cptest_need) ).toFixed(2);
      }
      this.setState({cptest_rate});
    }
  }

  render() {
    //从准入报告列表页,解析传过来的url中的work_id参数
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    flag = obj["flag"];
    // console.log(work_id);

    //下拉菜单 - menu - 安全测试
    const dropData_safe = ["未选择","蓝灯", "绿灯", "黄灯", "红灯"];
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
        <Menu.Item key={dropData_safe[4]}>
          <p>{dropData_safe[4]}</p>
        </Menu.Item>
      </Menu>
    );
    //下拉菜单 - menu - 相关服务已上线
    const dropData_service = ["未上线", "已上线"];
    const dropMenu_service = (
      <Menu onClick={this.menuOnclick_service.bind(this)}>
        <Menu.Item key={dropData_service[0]}>
          <p>{dropData_service[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_service[1]}>
          <p>{dropData_service[1]}</p>
        </Menu.Item>
      </Menu>
    );
    //下拉菜单 - menu - 合版后需求无更新
    const dropData_merge = ["无变更", "有变更"];
    const dropMenu_merge = (
      <Menu onClick={this.menuOnclick_merge.bind(this)}>
        <Menu.Item key={dropData_merge[0]}>
          <p>{dropData_merge[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_merge[1]}>
          <p>{dropData_merge[1]}</p>
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
          if_online_filename = info.fileList[0].response.data.filename;
          console.log(if_online_filename);
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
          no_change_after_merge_filename = info.fileList[0].response.data.filename;
          console.log(no_change_after_merge_filename);
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
    const props5 = {
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
          <Col span={6} className="title-txt">合版准入报告</Col>
        </Row>
        <div>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              Testlink入参
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入测试计划名称后可以检索到下面的内容" name="tl_id" value={this.state.tl_id}
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
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="1" name="tl_num_1" value={this.state.tl_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="2" name="tl_num_2" value={this.state.tl_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="" name="tl_num_3" value={this.state.tl_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="" name="tl_num_4" value={this.state.tl_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input type="number"
                  placeholder="" name="tl_num_total" value={this.state.tl_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="2" name="tl_rate_1" value={this.state.tl_rate_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="" name="tl_rate_2" value={this.state.tl_rate_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="" name="tl_rate_3" value={this.state.tl_rate_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="" name="tl_rate_4" value={this.state.tl_rate_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail"><Input type="number"
                  placeholder="" name="tl_rate_total" value={this.state.tl_rate_total} onChange={this.handleChange.bind(this)}/></Col>
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
            <Col span={6} className="test-result bug-css border-right-css">
              BUG分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4}
                     className="test-result-detail border-right-css border-bottom-css"><span>严重级别</span></Col>
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
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="2" name="jira_num_1" value={this.state.jira_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="3" name="jira_num_2" value={this.state.jira_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="" name="jira_num_3" value={this.state.jira_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="" name="jira_num_4" value={this.state.jira_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input type="number"
                  placeholder="" name="jira_num_total" value={this.state.jira_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4}
                     className="test-result-detail border-right-css border-bottom-css"><span>关闭数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="1" name="jira_close_num_1" value={this.state.jira_close_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="2" name="jira_close_num_2" value={this.state.jira_close_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="" name="jira_close_num_3" value={this.state.jira_close_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input type="number"
                  placeholder="" name="jira_close_num_4" value={this.state.jira_close_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input type="number"
                  placeholder="" name="jira_close_num_total" value={this.state.jira_close_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>修复比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="2" name="jira_repair_rate_1" value={this.state.jira_repair_rate_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="" name="jira_repair_rate_2" value={this.state.jira_repair_rate_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="" name="jira_repair_rate_3" value={this.state.jira_repair_rate_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input type="number"
                  placeholder="" name="jira_repair_rate_4" value={this.state.jira_repair_rate_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail"><Input type="number"
                  placeholder="" name="jira_repair_rate_total" value={this.state.jira_repair_rate_total} onChange={this.handleChange.bind(this)}/></Col>
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
                  <Input type="number" placeholder="" name="cptest_need" value={this.state.cptest_need} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">实际测试的机型/浏览器</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="cptest_final" value={this.state.cptest_final} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
              <Row>
                <Col span={18}
                     className="test-result-detail border-right-css border-bottom-css">百分率</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="cptest_rate" value={this.state.cptest_rate} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">安全测试</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
                 style={{ backgroundColor:(this.state.dropData_safe=="蓝灯"?"blue":(this.state.dropData_safe=="绿灯"?"green":(this.state.dropData_safe=="黄灯"?"yellow":(this.state.dropData_safe=="红灯"?"red":"white")))) }}
            >
              <div>
                <Dropdown overlay={dropMenu_safe} trigger={["click"]}>
                  <a style={{ color:"black" }} className="ant-dropdown-link" href="#">
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
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">相关服务已上线</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu_service} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_service}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-result-detail border-bottom-css">
              <Upload {...props2}>
                <Button>
                  <Icon type="upload" /> 相关服务已上线截图
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">合版后需求无更新</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu_merge} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_merge}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-result-detail border-bottom-css">
              <Upload {...props3}>
                <Button>
                  <Icon type="upload" /> 合版后需求无更新截图
                </Button>
              </Upload>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">测试报告结论</Col>
            <Col span={8} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={2}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
                 style={{ backgroundColor:(this.state.dropData_test=="未通过" ? "red" : "green") }}
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
              <Upload {...props4}>
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
                 style={{backgroundColor:(this.state.dropData_UAT=="未通过" ? "red" : "green") }}
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
              <Upload {...props5}>
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
                onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=0&pageTag=merge" }}
              >查看结果</Button>
            </Col>
            <Col span={24} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{
                        //提交 合板报告信息
                        this.getIntFromString();
                        //文件上传
                        this.state.safetest_file = (safetest_filename==undefined)?"":safetest_filename;
                        this.state.if_online_file = (if_online_filename==undefined)?"":if_online_filename;
                        this.state.no_change_after_merge_file = (no_change_after_merge_filename==undefined)?"":no_change_after_merge_filename;
                        this.state.test_result_file = (test_result_filename==undefined)?"":test_result_filename;
                        this.state.uat_result_file = (uat_result_filename==undefined)?"":uat_result_filename;
                        // debugger;
                        console.log(this.state);
                        api.postMergeReport(this.state).then(data=>{
                          if(data.status == 200){
                            console.log("merge report post success");
                            console.log(data);
                            window.location.href="index.html#/evaluationResult?flag=1&pageTag=merge&work_id=" + work_id
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
    }else if(this.state.dropData_safe == "蓝灯"){
      this.state.safetest_status = 1;
    }else if(this.state.dropData_safe == "绿灯"){
      this.state.safetest_status = 2;
    }else if(this.state.dropData_safe == "黄灯"){
      this.state.safetest_status = 3;
    }else if(this.state.dropData_safe == "红灯"){
      this.state.safetest_status = 4;
    }
    //相关服务已上线
    if(this.state.dropData_service == "未上线"){
      this.state.if_online = 0;
    }else if(this.state.dropData_service == "已上线"){
      this.state.if_online = 1;
    }
    //合版后需求无更新
    if(this.state.dropData_merge == "无变更"){
      this.state.no_change_after_merge = 0;
    }else if(this.state.dropData_merge == "有变更"){
      this.state.no_change_after_merge = 1;
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
    //新建合板报告前,获取合板的jira数据
    api.getMergeReport_Jira(work_id).then(data=> {
      console.log("merge report get jira success");
      console.log(data);
      console.log(work_id);
      //将获取的数据显示在合板页面中
      this.state = data.data;
      /*
       int型数据,解析成字符串类型的
       */
      //安全测试
      safeSta = this.state.safetest_status;
      if( safeSta== 0 || safeSta==null){
        this.setState({dropData_safe:"未选择"});
      }else if(safeSta == 1){
        this.setState({dropData_safe:"蓝灯"});
      }else if(safeSta ==2){
        this.setState({dropData_safe:"绿灯"});
      }else if(safeSta ==3){
        this.setState({dropData_safe:"黄灯"});
      }else if(safeSta ==4){
        this.setState({dropData_safe:"红灯"});
      }
      //相关服务已上线
      serviceSta = this.state.if_online;
      //合版后需求无更新
      mergeSta = this.state.no_change_after_merge;
      //测试报告结论
      testSta = this.state.test_result;
      //UAT验收结论
      UATSta = this.state.uat_result;
      this.setState({
        dropData_service:(serviceSta == 0)?"未上线":"已上线" ,
        dropData_merge:(mergeSta == 0)?"无变更":"有变更" ,
        dropData_test:(testSta == 0)?"未通过":"通过" ,
        dropData_UAT:(UATSta == 0)?"未通过":"通过" ,
        work_id:work_id,
      });
      console.log(this.state);
    });
  }
}