/**
 * Created by yang on 17/4/17.
 */
/*
 新建提测准入报告
 提测邮件,一项是下拉框单选项“发送”和“未发送”，发送为 - - 绿灯，未发送为 - - 红灯；
 Demo演示，共两个选项NA和通过，其中NA为 - - 绿灯，通过为 - - 蓝灯；

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
} from "antd";
import "../../less/newCheckInReport.less";
import {api} from "../api.js";

export default class NewCheckInReport extends Component {
  //状态初始化 -- 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      dropData: "发送",
      dropData_demo: "NA",

      work_id:"8",
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

  render() {
    //下拉菜单 - menu - 提测邮件
    const dropData = ["发送", "未发送"];
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
              <Input placeholder="输入测试计划名称后可以检索到下面的内容"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result border-right-css">
              测试用例结果分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">状态</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Pass"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Fail"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Block"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="NoRun"/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input placeholder="Total"/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">数量</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="1"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input placeholder=""/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css">比率</Col>
                <Col span={4} className="test-result-detail border-right-css"><Input placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail"><Input placeholder=""/></Col>
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
              <Input placeholder="输入需求名称或需求ID"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result bug-css border-right-css border-bottom-css">
              BUG分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">严重级别</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Block"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Critical"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Major"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Minor"/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input placeholder="Total"/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">数量</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="3"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input placeholder=""/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">关闭数量</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="1"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input placeholder=""/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">修复比率</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input placeholder=""/></Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              提测邮件
            </Col>
            <Col span={10} style={{ backgroundColor:((this.state.dropData=="发送")?"green":"red") }}
                 className="test-link-css dropdown-list-css dropdown-a-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={8} className="test-link-css border-bottom-css">
              <Input type="file" placeholder="上传附件"/>
            </Col>
          </Row>

          <Row>
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
              <Button
                onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=0&pageTag=checkin" }}
              >查看结果</Button>
            </Col>
            <Col span={12} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=1&pageTag=checkin" } }
              >提交</Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  componentDidMount() {
    //新建提测报告前,获取提测的jira数据
    api.getCheckinReport_Jira(this.state.work_id).then(data=> {
      console.log(data);
    });
  }
}
