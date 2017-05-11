/**
 * Created by yang on 17/4/10.
 */
/*
 月度统计表
 */
import React, {Component} from "react";
import {
  Input,
  Icon,
  Row, Col,
  Menu, Dropdown,
  Button,
  DatePicker,

} from 'antd';
import moment from 'moment';
import "../../less/monthStat.less";
import {api} from "../api.js";
import $ from "jquery";
import DptList from './dptList';
import LuyeTable from "./luyeTable/luyeTable.js";

//时间日期选择
const {MonthPicker, RangePicker} = DatePicker;

//获取当前时间
function getNowTime(date) {
  let y, m, d;
  y = date.getFullYear();
  m = date.getMonth() + 1;
  d = date.getDate();
  return ( y + "-" + (m < 10 ? ("0" + m) : m) + "-" + (d < 10 ? ("0" + d) : d) );
}

var currDate, currTime;//当前时间
currDate = new Date();
currTime = getNowTime(currDate);
let dep1_id, dep2_id, dep3_id,
  dep1_name, dep2_name, dep3_name; //1 2 3 级部门
export default class MonthStat extends Component {
  //状态初始化 -- input输入框 和 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      name: "",
      reporter_name: "",
      date_begin: "2017-04-01",
      date_end: currTime,
      deps: null,
      dep1_list: [],
      dep2_list: [],
      dep3_list: [],
      selected1: '',
      selected2: '',
      selected3: '',
      dep1_id: "全部",
      dep2_id: "",
      dep3_id: "",
      dp1: "",
    };
  }

  //时间日期选择
  onChange(date, dateString) {
    console.log(date);
    console.log(dateString);
    //更改提交时间的状态
    this.setState({
      date_begin: dateString[0],
      date_end: dateString[1],
    });
  }

  //输入框 -- onChange事件处理
  handleChange(e) {
    var obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
    console.log(this.state);
  }

  //下拉列表-事件处理 1
  menu1_Onclick(e) {
    console.log('click', e.key);
    this.setState({
      dep1_id: e.key,
    });
  }

  changeSubDep(e) {
    console.log(e);
    //pid is the id needed for ajax request
    const [id, depSelected, layer] = e.key.split('@');
    if (layer === '1') {
      const list = this.state.deps.dp2.filter((item)=>item.parent_id == parseInt(id))
      this.setState({dep2_list: list, dep3_list: [], selected1: depSelected, selected2: '', selected3: ''});
    }
    else if (layer === '2') {
      const list = this.state.deps.dp3.filter((item)=>item.parent_id == parseInt(id))
      this.setState({dep3_list: list, selected2: depSelected, selected3: ''});
    }
    else if (layer === '3') {
      this.setState({selected3: depSelected});
    }
  }

  componentWillMount() {
    api.getDepartment().then((data)=> {
      console.log(data);
      this.deps = data.data;
      this.setState({
        isLoaded: true,
        dep1_list: data.data.dp1,
        deps: data.data
      });
    })
  }

  render() {
    //下拉菜单 - menu
    dep1_id = this.state.dp1;

    const dropMenu1 = (
      <Menu onClick={this.menu1_Onclick.bind(this)}>
        <Menu.Item key={0}>
          <p>{0}</p>
        </Menu.Item>
      </Menu>
    );

    return (
      <div>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <Input addonBefore="需求名称" defaultValue={this.state.name} name="name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={6}>
            <Input addonBefore="报告人姓名" defaultValue={this.state.reporter_name} name="reporter_name"
                   onChange={this.handleChange.bind(this)}/>
          </Col>
          <Col span={12}>
            <span className="date-submit">提交时间</span>
            <div className="div-date-submit">
              <RangePicker defaultValue={[moment(this.state.date_begin), moment(this.state.date_end)]}
                           onChange={this.onChange.bind(this)}/>
            </div>
          </Col>
        </Row>
        <Row gutter={16} style={{marginBottom: 16}}>
          <Col span={6}>
            <DptList list={this.state.dep1_list} changeSubDep={this.changeSubDep.bind(this)} layer={1}
                     selected={this.state.selected1}/>
          </Col>
          <Col span={6}>
            <DptList list={this.state.dep2_list} changeSubDep={this.changeSubDep.bind(this)} layer={2}
                     selected={this.state.selected2}/>
          </Col>
          <Col span={6}>
            <DptList list={this.state.dep3_list} changeSubDep={this.changeSubDep.bind(this)} layer={3}
                     selected={this.state.selected3}/>
          </Col>
          <Col span={6}><Button style={{float: "right"}} type="primary"
                                onClick={ this.getMonthTbData.bind(this) }
          >查询</Button></Col>
        </Row>

        <div id="tb-div"></div>

      </div>

    );
  }

  getMonthTbData() {
    console.log(this.state);
    //调用接口函数
    api.getMonthStatList(this.state).then(data=> {
      console.log("MonthStatList get success");
      console.log(data);

      let arr = data.data;
      let typeStr = "",
        nodeStr1 = "", nodeStr2 = "",
        check_noteStr1 = "", check_noteStr2 = "";
      for (let i = 0; i < arr.length; i++) {
        //项目类型
        arr[i]["typeStr"] = (arr[i].type == 0) ? "App类" : "非App类";
        //节点类型 节点1: node1
        if (arr[i].node1 == 1) {
          nodeStr1 = "提测";
        }
        //节点类型 节点2: node2
        if (arr[i].node2 == 2) {
          nodeStr2 = "上线";
        } else if (arr[i].node2 == 3) {
          nodeStr2 = "合板";
        }
        arr[i]["nodeStr1"] = nodeStr1;
        arr[i]["nodeStr2"] = nodeStr2;
        //评估结论1
        if (arr[i].check1_note == 0) {
          check_noteStr1 = "待评估";
        } else if (arr[i].check1_note == 1) {
          check_noteStr1 = "蓝灯";
        } else if (arr[i].check1_note == 2) {
          check_noteStr1 = "绿灯";
        } else if (arr[i].check1_note == 3) {
          check_noteStr1 = "黄灯";
        } else if (arr[i].check1_note == 4) {
          check_noteStr1 = "红灯";
        }
        arr[i]["check_noteStr1"] = check_noteStr1;

        //评估结论2
        if (arr[i].check2_note == 0) {
          check_noteStr2 = "待评估";
        } else if (arr[i].check2_note == 1) {
          check_noteStr2 = "蓝灯";
        } else if (arr[i].check2_note == 2) {
          check_noteStr2 = "绿灯";
        } else if (arr[i].check2_note == 3) {
          check_noteStr2 = "黄灯";
        } else if (arr[i].check2_note == 4) {
          check_noteStr2 = "红灯";
        }
        arr[i]["check_noteStr2"] = check_noteStr2;
      }
      console.log(arr);
      //表格数据渲染
      var tbParam = {
        el: $("#tb-div"),
        data: arr,
        columns: [{cname: "报告ID", cdata: "id"},
          {cname: "需求名称", cdata: "name"},
          {cname: "需求ID", cdata: "jira_id"},
          {cname: "项目类型", cdata: "typeStr"},
          {cname: "报告人姓名", cdata: "tester_ctx"},
          {cname: "节点1", cdata: "nodeStr1"},
          {cname: "评估结论1", cdata: "check_noteStr1"},
          {cname: "审核次数1", cdata: "check1_count"},
          {cname: "节点2", cdata: "nodeStr2"},
          {cname: "评估结论2", cdata: "check_noteStr2"},
          {cname: "审核次数2", cdata: "check2_count"},
          {cname: "一级部门", cdata: "dep1_name"},
          {cname: "二级部门", cdata: "dep2_name"},
          {cname: "三级部门", cdata: "dep3_name"},
          {cname: "提交时间", cdata: "create_time"},
        ],
        managePageSize: true,
      };
      let tb = new LuyeTable(tbParam);

    });
  }

  componentDidMount() {
    //获取 1/2/3级部门的初始化数据
    api.getDepartmentData().then(data=> {
      console.log(data);

      this.setState({
        dp1: data.data.dp1,
        dp2: data.data.dp2,
        dp3: data.data.dp3,
      });
    });
  }

}

