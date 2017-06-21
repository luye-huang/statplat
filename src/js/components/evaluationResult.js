/**
 * Created by yang on 17/4/18.
 */
/*
 评估结果

 1.当评估结果为蓝灯和绿灯时，不需要审核，此时该页面只有“关闭” 按钮； 审核结果自动填写为通过.
 2.当评估结果为黄灯和红灯时，需要审核，此时该页面存在两个按钮“提交审批结果”和“关闭”
 --  点击“关闭” 进入提测-上线准入报告列表页,
 点击“提交审批结果”，进入审核页面.
 */
import React, {Component} from "react";
import {
  Row, Col,
  Input, Button,
} from "antd";
import "../../less/evaluationResult.less";
import {api} from "../api.js";
import func from "../api.js";

//url字符串处理函数
function dealUrl(url) {
  //获取第一次出现?的下标
  let first = url.indexOf("?");
  let _str = url.substr(first + 1, url.length); //截取问号?之后的内容
  let _arr = _str.split("&"); //用&分割字符串
  // console.log(_arr);

  let newObj = {};
  for (let i = 0; i < _arr.length; i++) {
    //将_arr数组中的字符串元素,用=分割成字符串数组,并选择第2个元素
    let eleKey = _arr[i].split("=")[0];
    let eleValue = _arr[i].split("=")[1];
    newObj[eleKey] = eleValue;
  }
  return newObj;
}
var pageTag; //分辨是从哪一个页面跳转过来的 : 提测/上线/合板
var work_id;
var status; //评估结论
let isExamBtnHide = true; //提交审核结果按钮 是否显示(默认显示)
export default class EvaluationResult extends Component {
  //初始化状态
  constructor(props) {
    super();
    this.state = {
      statusResult:"待评估",
      _flow:"",  //审核流程
    };
  }

  render() {
    //从提测准入报告页面跳转过来后,解析传过来的url中的flag参数
    let url = window.location.href;
    let obj = dealUrl(url);
    pageTag = obj["pageTag"];
    console.log(pageTag);
    work_id = obj["work_id"];
    this.state.work_id = work_id;
    console.log(this.state.work_id);
    let flag = obj["flag"];
    let isHide = flag==0?"none":"block";
    console.log(isHide);

    //评估结论
    debugger;
    if(this.state.status!=undefined){
      if(this.state.status == 0){
        this.state.statusResult = "未选择"
        isExamBtnHide = true; //按钮显示

      }else if(this.state.status == 1){
        this.state.statusResult = "蓝灯"
        isExamBtnHide = false; //蓝灯,按钮不显示

        //若为上线报告,则need_check默认为1,需要审核,则"提交审核按钮显示"
        /*if(this.state.need_check == 1){
          isExamBtnHide = true; //按钮显示
        }*/
      }
      else if(this.state.status == 2){
        this.state.statusResult = "绿灯"
        isExamBtnHide = false; //绿灯,按钮不显示
      }
      else if(this.state.status == 3){
        this.state.statusResult = "黄灯"
        isExamBtnHide = true; //按钮显示

      }else if(this.state.status == 4){
        this.state.statusResult = "红灯"
        isExamBtnHide = true; //按钮显示
      }
      console.log(isExamBtnHide);
    }

    return (
      <div>
        <Row className="row-margin-bottom">
          <Col span={11}></Col>
          <Col span={6} className="title-txt">评估结果</Col>
        </Row>
        <Row>
          <Col span={6} className="test-link-css border-bottom-css border-right-css">
            评估结论
          </Col>
          <Col span={18} className="test-link-css border-bottom-css"
               style={{
            backgroundColor: (status==0)?"white":(status==1?"blue":(status==2?"green":(status==3?"yellow":(status==4?"red":"white"))))}}
          >
            <span>
              {this.state.statusResult}
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={6} className="test-link-css border-bottom-css border-right-css">
            是否需要审核
          </Col>
          <Col span={18} className="test-link-css border-bottom-css">
            <span>{(this.state.need_check==1)?"需要审核":(this.state.need_check==0?"不需要审核":" ")}</span>
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

        <div>
          <Row className="jira-css row-btn-css">
            <Col span={12} offset={6}>
              <Button type="primary"
                      style={{ display:(isExamBtnHide==false?"none":"block") }}
                      onClick={ ()=>{ window.location.href="index.html#/examResult?pageTag="+pageTag+"&work_id="+work_id } }
              >提交审核结果</Button>
            </Col>
            <Col span={6}>
              <Button
                onClick={ ()=>{ window.location="index.html#/reportList" } }
              >关闭</Button>
            </Col>
          </Row>
        </div>

      </div>
    );
  }

  componentDidMount() {
    let flow;
    if (pageTag == "checkin") {
      //查看提测报告的 评估结果
      api.getCheckreportForCheckin(this.state.work_id).then(data=> {
        // console.log(data);
        this.state = data.data;
        console.log(this.state);

        status = this.state.status;
        console.log(status);
        flow = this.state.flow;
        this.setState({
          _flow:flow!=undefined?this.state.flow.join("->"):"无", //审核流程
        });

      });
    } else if (pageTag == "online") {
      //查看上线报告的 评估结果
      //debugger
      api.getCheckreportForOnline(this.state.work_id).then(data=> {
        // console.log(data);

        this.state = data.data;
        //上线报告不管是什么灯,都需要审核,所以need_check默认为1,
        // this.state.need_check = 1;
        console.log(this.state);

        status = this.state.status;
        console.log(status);
        flow = this.state.flow;
        this.setState({
          _flow:flow!=undefined?this.state.flow.join("->"):"无", //审核流程
        });
      });
    } else if (pageTag == "merge") {
      //查看合板报告的 评估结果
      api.getCheckreportForMerge(this.state.work_id).then(data=> {
        // console.log(data);
        this.state = data.data;
        console.log(this.state);

        status = this.state.status;
        console.log(status);
        flow = this.state.flow;
        this.setState({
          _flow:flow!=undefined?this.state.flow.join("->"):"无", //审核流程
        });
      });
    }

  }
}