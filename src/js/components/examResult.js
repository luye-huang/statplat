/**
 * Created by yang on 17/4/18.
 */

/*
    审核结果

 */
import React,{Component} from "react";
import {
    Row, Col,
    Menu, Dropdown,Icon,
    Input,Button,
} from "antd";
import "../../less/examResult.less";
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

var objData = {};
var pageTag; //分辨上上个页面是哪一个页面 : 提测/上线/合板
var work_id,
  flag; //flag为0 隐藏 ,即display:none
export default class ExamResult extends Component{
    //状态初始化 -- 下拉列表dropdown的初始化数据
    constructor(props){
        super();
        this.state = {
            dropData:"通过",
            reporter_ctx:"",
        };
    }

    ////下拉列表-点击事件处理
    menuOnclick(e){
        console.log(e.key);
        this.setState({
            dropData:e.key,
        });
    }

    //输入框 - onChange事件
    onChange(e){
        objData[e.target.name] = e.target.value;
        this.setState(objData);

        console.log(this.state);
    }

    render(){
        //解析从评估结果页面跳转过来的url 
        let url = window.location.href;
        let obj = dealUrl(url);
        pageTag = obj["pageTag"];
        work_id = obj["work_id"];
        console.log(work_id);
        flag = obj["flag"];
        console.log(flag);

        //下拉菜单 - menu - 提测邮件
        const dropData = ["通过", "未通过"];
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

        return(
            <div>
                <div>
                    <Row className="row-margin-bottom">
                        <Col span={11}></Col>
                        <Col span={6} className="title-txt">审核结果</Col>
                    </Row>
                    <Row>
                        <Col span={4} className="test-link-css border-bottom-css border-right-css">
                            提交人
                        </Col>
                        <Col span={8} className="test-link-css border-bottom-css border-right-css">
                            主要描述
                        </Col>
                        <Col span={6} className="test-link-css border-bottom-css border-right-css">
                            审核结果
                        </Col>
                        <Col span={6} className="test-link-css border-bottom-css">
                            附件
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} className="test-link-css border-bottom-css border-right-css">
                            <Input placeholder="v_chenxiaoer" name="reporter_ctx" value={ this.state.reporter_ctx } onChange={this.onChange.bind(this)}/>
                        </Col>
                        <Col span={8} className="test-link-css border-bottom-css border-right-css">
                            <Input placeholder="上线-提测-合板,,," name="comment" onChange={this.onChange.bind(this)}/>
                        </Col>
                        <Col span={6} className="test-link-css border-bottom-css border-right-css dropdown-list-css">
                            <div>
                                <Dropdown overlay={dropMenu} trigger={["click"]}>
                                    <a className="ant-dropdown-link" href="#">
                                        {this.state.dropData}
                                        <Icon type="down"/>
                                    </a>
                                </Dropdown>
                            </div>
                        </Col>
                        <Col span={6} className="test-link-css border-bottom-css">
                            <Input type="file" />
                        </Col>
                    </Row>
                    <Row>
                        <Col span={4} className="test-link-css border-right-css">
                            <Input placeholder="" />
                        </Col>
                        <Col span={8} className="test-link-css border-right-css">
                            <Input placeholder="" />
                        </Col>
                        <Col span={6} className="test-link-css border-right-css">
                            <Input placeholder="" />
                        </Col>
                        <Col span={6} className="test-link-css">
                            <Input placeholder="" />
                        </Col>
                    </Row>
                    <Row style={{ display:(flag==0?"none":"block") }} className="jira-css row-btn-css">
                        <Col span={12} className="submit-btn">
                            <Button
                                onClick={ ()=>{ window.location="index.html#/reportList" } }
                            >关闭</Button>
                        </Col>
                        <Col span={12} className="submit-btn">
                            <Button type="primary"
                                    onClick={ ()=>{
                                        //是否审核通过
                                        let if_pass = this.state.dropData=="通过" ? 1 : 0;
                                        objData["if_pass"] = if_pass;
                                        console.log(objData);
                                        if(pageTag == "checkin"){
                                            //提交 提测报告审核信息
                                            api.postCheckreportForCheckin(objData).then(data=>{
                                                if(data.status == 200){
                                                    console.log("Checkreport For Checkin success");
                                                    alert("success");
                                                    window.location="index.html#/reportList?exam_result=1";
                                                }else if(data.status == 500){
                                                    console.log(data.message);
                                                    alert(data.message);
                                                }
                                                console.log(data);
                                            });
                                        }else if(pageTag == "online"){
                                            //提交 上线报告审核信息
                                            api.postCheckreportForOnline(objData).then(data=>{
                                                if(data.status == 200){
                                                    console.log("Checkreport For Online success");
                                                    alert("success");
                                                    window.location="index.html#/reportList?exam_result=1";
                                                }else if(data.status == 500){
                                                    console.log(data.message);
                                                    alert(data.message);
                                                }
                                                console.log(data);
                                            });
                                            console.log("CheckreportForOnline");
                                        }else if(pageTag == "merge"){
                                            //提交 合板报告审核信息
                                            api.postCheckreportForMerge(objData).then(data=>{
                                                if(data.status == 200){
                                                    console.log("Checkreport For Merge success");
                                                    alert("success");
                                                    window.location="index.html#/reportList?exam_result=1";
                                                }else if(data.status == 500){
                                                    console.log(data.message);
                                                    alert(data.message);
                                                }
                                                console.log(data);
                                            });
                                        }
                                    } }
                            >提交</Button>
                        </Col>
                    </Row>
                </div>

                <div style={{ display:"block" }}>
                    <Row className="row-margin-bottom row-margin-top">
                        <Col span={11}></Col>
                        <Col span={6} className="title-txt">Log记录</Col>
                    </Row>
                    <Row>
                        <Col span={6} className="test-link-css border-bottom-css border-right-css">
                            提交审核人
                        </Col>
                        <Col span={18} className="test-link-css border-bottom-css">
                            主要描述
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} className="test-link-css border-bottom-css border-right-css">
                            <span>v_chenxiaoer</span>
                        </Col>
                        <Col span={18} className="test-link-css border-bottom-css">
                            <span>上线-提测-合板,,,</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6} className="test-link-css border-right-css">
                            <span></span>
                        </Col>
                        <Col span={18} className="test-link-css">
                            <span></span>
                        </Col>
                    </Row>
                </div>

            </div>
        );
    }

    componentDidMount(){
        //获取项目信息 --  取到测试人员的ctx
        api.getNewProject(work_id).then(data=>{
            console.log("project info get success");
            console.log(data);
            //取到测试人员的ctx,显示到页面上
            objData["reporter_ctx"] = data.data.tester_ctx;
            objData["work_id"] = work_id;
            this.setState(objData);

            console.log(this.state);
        });
    }
}