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
} from "antd";
import {api} from "../api.js";

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

      work_id:"8"
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

  render() {
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
                <Col span={4} className="test-result-detail border-bottom-css"><Input
                  placeholder="Total"/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">数量</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="1"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input
                  placeholder=""/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css">比率</Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder=""/></Col>
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
              <Input placeholder="摘要中需求名称"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result bug-css border-right-css">
              BUG分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4}
                     className="test-result-detail border-right-css border-bottom-css">严重级别</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Block"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Critical"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Major"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="Minor"/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input
                  placeholder="Total"/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">数量</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="3"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input
                  placeholder=""/></Col>
              </Row>
              <Row>
                <Col span={4}
                     className="test-result-detail border-right-css border-bottom-css">关闭数量</Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="1"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-bottom-css"><Input
                  placeholder=""/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css">修复比率</Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder="2"/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail border-right-css"><Input
                  placeholder=""/></Col>
                <Col span={4} className="test-result-detail"><Input placeholder=""/></Col>
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
                <Col span={6} className="test-result-detail border-bottom-css"></Col>
              </Row>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">实际测试的机型/浏览器</Col>
                <Col span={6} className="test-result-detail border-bottom-css"></Col>
              </Row>
              <Row>
                <Col span={18}
                     className="test-result-detail border-right-css border-bottom-css">百分率</Col>
                <Col span={6} className="test-result-detail border-bottom-css"></Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">安全测试</Col>
            <Col span={10} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={3}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu_safe} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData_safe}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={5} className="test-result-detail border-bottom-css">
              <Input type="file"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">相关服务已上线</Col>
            <Col span={10} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={3}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu_service} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData_service}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={5} className="test-result-detail border-bottom-css">
              <Input type="file"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">合版后需求无更新</Col>
            <Col span={10} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={3}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu_merge} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData_merge}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={5} className="test-result-detail border-bottom-css">
              <Input type="file"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">测试报告结论</Col>
            <Col span={10} className="test-result-detail border-right-css border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={3}
                 className="test-result-detail dropdown-list-css border-right-css border-bottom-css">
              <div>
                <Dropdown overlay={dropMenu_test} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData_test}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={5} className="test-result-detail border-bottom-css">
              <Input type="file"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css">UAT验收结论</Col>
            <Col span={10} className="test-result-detail border-right-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
            <Col span={3} className="test-result-detail dropdown-list-css border-right-css">
              <div>
                <Dropdown overlay={dropMenu_UAT} trigger={["click"]}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.dropData_UAT}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={5} className="test-result-detail">
              <Input type="file"/>
            </Col>
          </Row>
        </div>

        <div>
          <Row className="jira-css row-btn-css">
            <Col span={12} className="look-result-btn">
              <Button
                onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=0&pageTag=merge" }}
              >查看结果</Button>
            </Col>
            <Col span={12} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=1&pageTag=merge" } }
              >提交</Button>
            </Col>
          </Row>
        </div>

      </div>
    );
  }

  componentDidMount() {
    //新建合板报告前,获取合板的jira数据
    api.getMergeReport_Jira(this.state.work_id).then(data=> {
      console.log(data);
    });
  }


}