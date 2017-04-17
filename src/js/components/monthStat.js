/**
 * Created by yang on 17/4/10.
 */
/*
 月度统计表
 */
import React, {Component} from "react";
import {
    Input,
    Select,
    Icon,
    Row, Col,
    Menu,
    Button,
    DatePicker,

} from 'antd';
import moment from 'moment';
import "../../less/monthStat.less";

//时间日期选择
const { MonthPicker, RangePicker } = DatePicker;
function onChange(date, dateString) {
    console.log(date);
    console.log( dateString);
}
//获取当前时间
function getNowTime(date){
    let y, m, d;
    y = date.getFullYear();
    m = date.getMonth() + 1;
    d = date.getDate();
    return ( y +"-"+ (m<10?("0"+m):m) + "-" + (d<10?("0"+d):d) );
}

export default class MonthStat extends Component{
    //状态初始化 -- input输入框 和 下拉列表dropdown
    constructor(props){
        super();
        this.state = {
            requirement:"xuqiu",
            reporter:"reporter",
            dateSubmit:"dateSubmit",
            dep2:"dep2",
            dep1:"dep1",
            team:"team",
            dropData:"未通过",

        };
    }

    //下拉列表-事件处理
    menuOnclick(e) {
        console.log('click', e.key);
        this.setState({
            dropData:e.key,
        });
    }
    //输入框 -- onChange事件处理
    handleChange(e) {
        var obj = {};
        obj[e.target.name] = e.target.value;
        // 滞后
        this.setState(obj);
        console.log(this.state);

    }

    render(){
        //当前时间
        let currDate = new Date();
        let currTime = getNowTime(currDate);

        return(
            <div>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Input addonBefore="需求名称" defaultValue={this.state.requirement} name="requirement"
                               onChange={this.handleChange.bind(this)}/>
                    </Col>
                    <Col span={6}>
                        <Input addonBefore="报告人姓名" defaultValue={this.state.reporter} name="reporter"
                               onChange={this.handleChange.bind(this)}/>
                    </Col>
                    <Col span={12}>
                        <span className="dateSubmit">提交时间</span>
                        <div className="divDateSubmit">
                            <RangePicker defaultValue={[moment(currTime),null]} onChange={onChange} name="dateSubmit"/>
                        </div>
                    </Col>
                </Row>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    <Col span={6}>
                        <Input addonBefore="二级部门" defaultValue={this.state.dep2} name="dep2"
                               onChange={this.handleChange.bind(this)}/>
                    </Col>
                    <Col span={6}>
                        <Input addonBefore="一级部门" defaultValue={this.state.dep1} name="dep1"
                               onChange={this.handleChange.bind(this)}/>
                    </Col>
                    <Col span={6}>
                        <Input addonBefore="责任人团队" defaultValue={this.state.team} name="team"
                               onChange={this.handleChange.bind(this)}/>
                    </Col>
                    <Col span={6}><Button style={{ float:"right" }} type="primary">查询</Button></Col>
                </Row>
                
                <div id="tb-div"></div>

            </div>

        );
    }
}

