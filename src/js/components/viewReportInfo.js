/**
 * Created by yang on 17/5/17.
 */

import React ,{Component} from "react";
import {
  Button,Input,
  Row, Col,
} from "antd";
import {api} from "../api.js";
import {dealUrl} from "../api.js";

let work_id; //每条数据的工作流work_id
let node; //节点
let _date_begin, _date_end;
export default class ViewReportInfo extends Component{
  constructor() {
    super();
    this.state = {
      inputState:"",
      projectType:"",
      testPeriod:"",
    };
  }

  handleChange(e){
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState( obj );
  }

  render(){
    //解析从准入报告页面传过来的url,和其中的参数work_id
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    node = obj["node"];
    
    return(
      <div>
        <Row style={{marginBottom: 20}}>
          <Col span={24} className="title-txt" style={{ textAlign:"center" }}>查看项目信息</Col>
        </Row>
        <div>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              *需求名称
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入需求名称" name="name" value={this.state.name}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              *需求ID
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入需求ID" name="jira_id" value={this.state.jira_id}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              版本
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入版本" name="version" value={this.state.version!=null?this.state.version:"无"}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              *项目类型
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入项目类型 , 示例 : App类 或 非App类" name="projectType" value={this.state.projectType}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              *测试周期
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入测试周期 , 示例 : 2017-06-22 - 2017-06-23" name="testPeriod" value={this.state.testPeriod}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-link-css border-right-css">
              测试人员
            </Col>
            <Col span={18} className="test-link-css">
              <Input placeholder="输入测试人员" name="testers" value={this.state.testers}
                     onChange={this.handleChange.bind(this)}/>
            </Col>
          </Row>
        </div>

        <Row style={{ marginTop:25 }}>
          <Col span={12} offset={6}>
            <Button type="primary" style={{ display:(node==0)?"block":"none" }}
                    onClick={
                        ()=>{
                          window.location = "index.html#/newProject?work_id=" + work_id + "&_date_begin=" + _date_begin + "&_date_end=" + _date_end;
                        }
                     }
            >编辑</Button>
          </Col>
          <Col span={6} >
            <Button onClick={ ()=>{ window.location="index.html#/reportList" } }>关闭</Button>
          </Col>
        </Row>
        
      </div>
    );
  }
  
  componentDidMount() {
    //获取 项目信息
    api.getNewProject(work_id).then(data=> {
      if (data.status == 200) {
        console.log(data.data);
        _date_begin = data.data.date_begin;
        _date_end = data.data.date_end;
        let jira_id = data.data.jira_id;
        data.data["jira_id"] = jira_id.join(",");
        this.setState(data.data);
        this.setState({
          work_id: work_id,
          projectType: data.data.type == 0 ? "App类" : "非App类",
          testPeriod: data.data.date_begin + "  -  " + data.data.date_end,
        });
      }
    });

  }
}