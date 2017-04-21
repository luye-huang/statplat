/**
 * Created by yang on 17/4/18.
 */
/*
 评估结果

 1.当评估结果为蓝灯和绿灯时，不需要审核，此时该页面只有“关闭” 按钮； 审核结果自动填写为通过.
 2.当评估结果为黄灯和蓝灯时，需要审核，此时该页面存在两个按钮“提交审批结果”和“关闭”
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
export default class EvaluationResult extends Component {
  //初始化状态
  constructor(props) {
    super();
    this.state = {
      work_id: "8",
    };
  }

  render() {
    //从提测准入报告页面条转过来后,解析传过来的url中的flag参数
    let url = window.location.href;
    let obj = dealUrl(url);
    pageTag = obj["pageTag"];
    console.log(pageTag);
    let flag = obj["flag"];
    let isHide = (flag == 1) ? "block" : "none";
    console.log(isHide);

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
          <Col span={18} className="test-link-css border-bottom-css">
            <span>蓝灯 or 绿灯 or 黄灯 or 红灯</span>
          </Col>
        </Row>
        <Row>
          <Col span={6} className="test-link-css border-bottom-css border-right-css">
            是否需要审核
          </Col>
          <Col span={18} className="test-link-css border-bottom-css">
            <span>未通过 or 通过不需要审核</span>
          </Col>
        </Row>
        <Row>
          <Col span={6} className="test-link-css border-right-css">
            审核流程
          </Col>
          <Col span={18} className="test-link-css">
            <span>显示配置项中配置的流程内容</span>
          </Col>
        </Row>

        <div style={{ display: isHide }}>
          <Row className="jira-css row-btn-css">
            <Col span={12} className="look-result-btn">
              <Button type="primary"
                      onClick={ ()=>{ window.location="index.html#/examResult" } }
              >提交审批结果</Button>
            </Col>
            <Col span={12} className="submit-btn">
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
    if (pageTag == "checkin") {
      //查看提测报告的 评估结果
      api.getCheckreportForCheckin(this.state.work_id).then(data=> {
        console.log(data);
      });
    } else if (pageTag == "online") {
      //查看上线报告的 评估结果
      api.getCheckreportForOnline(this.state.work_id).then(data=> {
        console.log(data);
      });
    } else if (pageTag == "merge") {
      //查看合板报告的 评估结果
      api.getCheckreportForMerge(this.state.work_id).then(data=> {
        console.log(data);
      });
    }

  }
}