/**
 * Created by yang on 17/4/17.
 */
/*
 新建提测准入报告
 提测邮件,一项是下拉框单选项“发送”和“未发送”，发送为 - - 绿灯，未发送为 - - 红灯；
 //Demo演示，共两个选项NA和通过，其中NA为 - - 绿灯，通过为 - - 蓝灯；

 当评估结果为蓝灯和绿灯时，不需要审核，
 此时该页面只有“关闭”按钮，审核结果自动填写为自动审核通过；选择“关闭”按钮，返回列表页，
 当评估结果为黄灯和蓝灯时，需要审批，
 审批流程按照配置管理中设置的显示；此时页面有两个按钮“提交审批结果”和“关闭”；
 点击“关闭”返回列表页，审核结果显示为待审核；点击“提交审批结果”则进入审核页面，

 查看结果/提交 按钮跳转时的传参:
 - - 查看结果 按钮 对应 flag = 0
 提交 按钮 对应 flag = 1
 */
import React, {Component} from "react";
import {
  Row, Col,
  Input, Button,
  Menu, Dropdown, Icon,
  Upload, message,
} from "antd";
import "../../less/newCheckInReport.less";
import {api} from "../api.js";
import {domain} from "../api.js";
import {dealUrl} from "../api.js";

var objData = {};
var work_id;
let if_email; // 提测邮件 int
let email_filename; // string
export default class NewCheckInReport extends Component {
  //状态初始化 -- 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      dropData: "未发送",
      // dropData_demo: "NA",
      email_file:"",
    };
  }

  //下拉列表-事件处理 -- 提测邮件
  menuOnclick(e) {
    console.log('click', e.key);
    this.setState({
      dropData: e.key,
    });
  }

  //下拉列表-事件处理 -- demo演示
  menuOnclickDemo(e) {
    console.log('click', e.key);
    this.setState({
      dropData_demo: e.key,
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
      this.setState({tl_num_total,tl_rate_1,tl_rate_2,tl_rate_3,tl_rate_4,tl_rate_total,});
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
  }

  render() {
    //从准入报告列表页,解析传过来的url中的work_id参数
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    console.log(work_id);

    //下拉菜单 - menu - 提测邮件
    const dropData = ["已发送", "未发送"];
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
    //下拉列表 -- demo演示
    const dropData_demo = ["NA", "已演示"];
    const dropMenu_demo = (
      <Menu onClick={this.menuOnclickDemo.bind(this)}>
        <Menu.Item key={dropData_demo[0]}>
          <p>{dropData_demo[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_demo[1]}>
          <p>{dropData_demo[1]}</p>
        </Menu.Item>
      </Menu>
    );

    //提测邮件文件上传
    const props = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
          console.log(info.fileList[0].response);
          email_filename = info.fileList[0].response.data.filename;
          console.log(email_filename);
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
          <Col span={6} className="title-txt">提测准入报告</Col>
        </Row>
        <div>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              Testlink入参
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入测试计划名称" name="tl_id" value={this.state.tl_id}
                     onChange={this.handleChange.bind(this)}/>
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
                  <Input type="number" placeholder="" name="tl_num_1" value={this.state.tl_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_2" value={this.state.tl_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_3" value={this.state.tl_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_4" value={this.state.tl_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_total" value={this.state.tl_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="0.1" name="tl_rate_1" value={this.state.tl_rate_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_2" value={this.state.tl_rate_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_3" value={this.state.tl_rate_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_4" value={this.state.tl_rate_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail">
                  <Input type="number" placeholder="" name="tl_rate_total" value={this.state.tl_rate_total} onChange={this.handleChange.bind(this)}/></Col>
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
              <Input placeholder="输入需求名称或需求ID" name="jira_id" value={this.state.jira_id}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result bug-css border-right-css border-bottom-css">
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
                  <Input type="number" placeholder="" name="jira_num_total" value={this.state.jira_num_total} onClick={this.handleChange.bind(this)}/></Col>
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
                  <Input type="number" placeholder="" name="jira_close_num_total" value={this.state.jira_close_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>修复比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="2" name="jira_repair_rate_1" value={this.state.jira_repair_rate_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_2" value={this.state.jira_repair_rate_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_3" value={this.state.jira_repair_rate_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_4" value={this.state.jira_repair_rate_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_total" value={this.state.jira_repair_rate_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col span={6} className="test-link-css border-right-css">
              提测邮件
            </Col>
            <Col span={8} style={{ backgroundColor:((this.state.dropData=="已发送")?"green":"red") }}
                 className="test-result-detail dropdown-list-css dropdown-a-css border-right-css">
              <div>
                <Dropdown overlay={dropMenu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={10} className="test-link-css">
              <Upload {...props}>
                <Button>
                  <Icon type="upload" /> 发送提测邮件
                </Button>
              </Upload>
            </Col>
          </Row>

          <Row style={{ display:"none" }}>
            <Col span={6} className="test-link-css border-right-css">
              Demo演示
            </Col>
            <Col span={10} style={{ backgroundColor:((this.state.dropData_demo=="NA")?"green":"#108ee9") }}
                 className="test-link-css dropdown-list-css dropdown-a-css border-right-css">
              <div>
                <Dropdown overlay={dropMenu_demo} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData_demo}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-link-css">
              <Input type="file" placeholder="上传附件"/>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="jira-css row-btn-css">
            <Col span={12} className="look-result-btn">
              <Button style={{ display:"none"}}
                onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=0&pageTag=checkin" }}
              >查看结果</Button>
            </Col>
            <Col span={24} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{
                      //提交 提测报告信息
                      this.state.if_email = (this.state.dropData == "已发送")? 1 : 0 ;
                      //提测文件
                      this.state.email_file = (email_filename==undefined)?"":email_filename;
                      console.log(this.state);
                      debugger;
                      for(var key in this.state){
                        if(!this.state[key])
                        return;
                      }

                      api.postCheckinReport(this.state).then(data=>{
                        console.log(data);
                        if(data.status == 200){
                          console.log("checkin report post success");
                          window.location.href="index.html#/evaluationResult?flag=1&pageTag=checkin&work_id="+ work_id;
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

  componentDidMount() {
    //新建提测报告前,获取提测的jira数据
    api.getCheckinReport_Jira(work_id).then(data=> {
      console.log("checkin report get jira success");
      console.log(data);
      // objData = data.data;
      // objData["work_id"] = work_id;
      console.log(work_id);

      //将获取到的数据显示到页面上
      this.state = data.data;
      this.setState({
        //提测邮件
        dropData:(data.data.if_email==1)?"已发送":"未发送",
        work_id:work_id,
        if_email:(this.state.dropData == "已发送")? 1 : 0 ,
      });
      console.log(this.state);
    });
  }
}
