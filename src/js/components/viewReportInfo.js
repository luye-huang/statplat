/**
 * Created by yang on 17/5/17.
 */

import React ,{Component} from "react";
import {
  Input,
  Row, Col,
} from "antd";
import {api} from "../api.js";
import {dealUrl} from "../api.js";

let work_id; //每条数据的工作流work_id
export default class ViewReportInfo extends Component{
  constructor() {
    super();
    this.state = {

    };
  }

  render(){
    //解析从准入报告页面传过来的url,和其中的参数work_id
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    console.log(work_id);

    return(
      <div>
        <Row style={{marginBottom: 20}}>
          <Col span={24} className="title-txt" style={{ textAlign:"center" }}>查看项目信息</Col>
        </Row>
        <div>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              需求名称
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              {this.state.name}
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              需求ID
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              {this.state.jira_id}
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              项目类型
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <span>{this.state.type==0?"App类":"非App类"}</span>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              测试周期
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              {this.state.date_begin + "  --  "+ this.state.date_end}
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css">
              测试人员
            </Col>
            <Col span={18} className="test-link-css">
              <span>{this.state.testers}</span>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  componentDidMount(){
    //获取 项目信息
    api.getNewProject(work_id).then(data=>{
      if(data.status == 200){
        console.log("project info get success");
        console.log(data.data);
        this.setState(data.data);
      }
    });

  }
}