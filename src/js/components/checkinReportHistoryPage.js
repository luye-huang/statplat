/**
 * Created by yang on 17/5/9.
 */
/*
 提测报告历史页面
 */

import React, {Component} from "react";
import {
  Row, Col,
  Input, Button,
  Menu, Dropdown, Icon,
} from "antd";
import "../../less/checkinReportHistoryPage.less";
import {api} from "../api.js";
import {dealUrl} from "../api.js";
import {domain} from "../api.js";

let work_id; //每条数据的工作流work_id
let status; //评估结论
let data1, data2;
let rows;
export default class CheckinReportHistoryPage extends Component {
  constructor() {
    super();
    this.state = {
      dropData: "",
      _statusResult: "待评估",
      _flow: "",  //审核流程
      _log: "",
    };
  }

  empty() {
    return (
      <Row class="">
        <Col span={6} className="test-link-css border-top-no border-right-css">
          <span>{ "无" }</span>
        </Col>
        <Col span={18} className="test-link-css border-top-no">
          <span>{ "无" }</span>
        </Col>
      </Row>
    );
  };

  render() {
    //解析从准入报告页面传过来的url,和其中的参数work_id
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    
    if (this.state._log != undefined) {
      let count = 0;
      if (this.state._log.length > 0) {
        rows = this.state._log.map((value)=> {
          count++;
          return (
            <Row class="" key={ count }>
              <Col span={6} className="test-link-css border-top-no border-right-css">
                <span>{value.user}</span>
              </Col>
              <Col span={18} className="test-link-css border-top-no">
                <span>{value.comment}</span>
              </Col>
            </Row>
          );

        });
      } else {
        rows = this.empty();
      }
    }

    return (
      <div>
        <Row>
          <Col span={24}>提测准入报告历史页面</Col>
        </Row>
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
              { this.state.tl_id }
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
                  {this.state.tl_num_1} </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.tl_num_2} </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.tl_num_3} </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.tl_num_4} </Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  {this.state.tl_num_total} </Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>比率</span></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  {this.state.tl_rate_1} </Col>
                <Col span={4} className="test-result-detail border-right-css">
                  {this.state.tl_rate_2} </Col>
                <Col span={4} className="test-result-detail border-right-css">
                  {this.state.tl_rate_3} </Col>
                <Col span={4} className="test-result-detail border-right-css">
                  {this.state.tl_rate_4} </Col>
                <Col span={4} className="test-result-detail">
                  {this.state.tl_rate_total} </Col>
              </Row>
            </Col>
          </Row>
        </div>
        <div>
          <Row className="margin-top-css1">
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              JIRA入参
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              {this.state.jira_id}
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
                  {this.state.jira_num_1}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_num_2}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_num_3}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_num_4}
                </Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  {this.state.jira_num_total}
                </Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>关闭数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_close_num_1}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_close_num_2}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_close_num_3}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_close_num_4}
                </Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  {this.state.jira_close_num_total}
                </Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>修复比率</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_repair_rate_1}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_repair_rate_2}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_repair_rate_3}
                </Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  {this.state.jira_repair_rate_4}
                </Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  {this.state.jira_repair_rate_total}
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col span={6} className="test-link-css border-right-css">
              提测邮件
            </Col>
            <Col span={8} className="test-result-detail border-right-css">
              {this.state.dropData}
            </Col>
            <Col span={10} className="test-link-css">
              <a href={ (this.state.email_file=="")?"":(domain+this.state.email_file) } target="_Blank">
                { (this.state.email_file=="")?"":"查看提测邮件" }</a>
            </Col>
          </Row>
        </div>

        <div>
          <Row className="row-margin-bottom margin-top-css">
            <Col span={11}></Col>
            <Col span={6} className="title-txt">评估结果</Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-bottom-css border-right-css">
              评估结论
            </Col>
            <Col span={18} className="test-link-css border-bottom-css"
                 style={{
                      backgroundColor: (status==0)?"white":(status==1?"blue":(status==2?"green":(status==3?"yellow":(status==4?"red":"white"))))
                  }}
            >
            <span>
              {this.state._statusResult}
            </span>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-bottom-css border-right-css">
              是否需要审核
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <span>{(this.state.need_check == 1) ? "需要审核" : (this.state.need_check == 0 ? "不需要审核" : " ")}</span>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css">
              审核流程
            </Col>
            <Col span={18} className="test-link-css">
              <span>{this.state._flow}</span>
            </Col>
          </Row>
        </div>

        <div>
          <Row className="row-margin-bottom row-margin-top">
            <Col span={11}></Col>
            <Col span={6} className="title-txt">Log记录</Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css">
              提交审核人
            </Col>
            <Col span={18} className="test-link-css">
              主要描述
            </Col>
          </Row>

          <ul>
            {rows}
          </ul>

        </div>
      </div>
    );
  }

  componentDidMount() {
    let flow;
    //获取提测报告的信息
    api.getCheckinReport_Jira(work_id).then(data=> {
      data1 = data.data;

    });
    //获取评估结果和审核结果即log记录日志
    api.getCheckreportForCheckin(work_id).then(data=> {
      //console.log("审核结果即log记录日志");
      console.log(data);
      data2 = data.data;
      this.state = Object.assign({}, data1, data2);
      status = this.state.status;
      //评估结论
      if (status == 0) {
        this.state._statusResult = "未选择"

      } else if (status == 1) {
        this.state._statusResult = "蓝灯"
      }
      else if (status == 2) {
        this.state._statusResult = "绿灯"
      }
      else if (status == 3) {
        this.state._statusResult = "黄灯"

      } else if (status == 4) {
        this.state._statusResult = "红灯"
      }
      //审核流程
      flow = this.state.flow;
      this.setState({
        dropData: (this.state.if_email == 0) ? "未发送" : "已发送", //提测邮件
        _flow: flow.length != 0 ? flow.join("->") : "无", //审核流程
      });

      //log记录日志
      this.setState({
        _log: this.state.loglist,
      });

    });
  }
}