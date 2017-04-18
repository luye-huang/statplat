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

export default class ExamResult extends Component{
    //状态初始化 -- 下拉列表dropdown的初始化数据
    constructor(props){
        super();
        this.state = {
            dropData:"通过",
        };
    }

    ////下拉列表-点击事件处理
    menuOnclick(e){
        console.log(e.key);
        this.setState({
            dropData:e.key,
        });
    }

    render(){
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
                            <Input placeholder="v_chenxiaoer" />
                        </Col>
                        <Col span={8} className="test-link-css border-bottom-css border-right-css">
                            <Input placeholder="上线-提测-合板,,," />
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
                    <Row className="jira-css row-btn-css">
                        <Col span={12} className="submit-btn">
                            <Button
                                onClick={ ()=>{ window.location="index.html#/reportList" } }
                            >关闭</Button>
                        </Col>
                        <Col span={12} className="submit-btn">
                            <Button type="primary"
                                    onClick={ ()=>{ window.location="index.html#/reportList?exam_result=1" } }
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
}