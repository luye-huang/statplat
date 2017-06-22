/**
 * Created by yang on 17/4/19.
 */
/*
 上线准入报告

 修复比率=关闭数量/数量; 其结果根据配置管理中的阈值设置底色显示出不同的颜色（蓝色 绿色  黄色  红色）
 未有解决方案:其数量是指除rejected postpone 以及closed or close三个状态之外的状态。
 Total为0是是已解决，否则为未解决； 未解决的则为黄灯（底色显示黄色）


 */
import React, {Component} from "react";
import {
  Row, Col,
  Input, Button,
  Menu, Dropdown, Icon,
  Upload, message,
} from "antd";
import "../../less/newOnlineReport.less";
import {api} from "../api.js";
import {domain} from "../api.js";
import {dealUrl} from "../api.js";

let work_id,
  flag; //flag为0 隐藏 ,即display:none
var safeSta, //安全测试 状态
  weakSta, //弱网测试 状态
  testSta, //测试报告结论 状态
  UATSta; //UAT验收结论 状态
let test_result_filename,
  uat_result_filename;
var colorConfigData; //储存颜色配置的数据
export default class NewOnlineReport extends Component {
  //状态初始化 -- 下拉列表dropdown
  constructor(props) {
    super();
    this.state = {
      dropData_safe: "",
      dropData_weak: "NA",
      dropData_test: "通过",
      dropData_UAT: "通过",
      test_result_file:"",
      uat_result_file:"",
    };
  }

  //下拉列表-事件处理 -- #弱网测试总结
  menuOnclick_weak(e) {
    console.log('click', e.key);
    this.setState({
      dropData_weak: e.key,
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

  //输入框 的onChange事件监听
  handleChange(e) {
    let obj = {};
    obj[e.target.name] = e.target.value;
    this.setState(obj);
    this.state[e.target.name] = e.target.value;
    if (['tl_num_1', 'tl_num_2', 'tl_num_3', 'tl_num_4'].includes(e.target.name) && this.state.tl_num_4 != undefined && this.state.tl_num_1 != undefined && this.state.tl_num_2 != undefined && this.state.tl_num_3 != undefined) {
      const {tl_num_1, tl_num_2, tl_num_3, tl_num_4} = this.state;
      let tl_num_total = Number.parseInt(tl_num_1) + Number.parseInt(tl_num_2) + Number.parseInt(tl_num_3) + Number.parseInt(tl_num_4);
      //debugger
      const tl_rate_1 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_1) / tl_num_total).toFixed(2);
      const tl_rate_2 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_2) / tl_num_total).toFixed(2);
      const tl_rate_3 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_3) / tl_num_total).toFixed(2);
      const tl_rate_4 = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_4) / tl_num_total).toFixed(2);
      const tl_rate_total = Number.isNaN(tl_num_total) ? '' : parseFloat(Number.parseInt(tl_num_total) / tl_num_total).toFixed(2);
      tl_num_total = Number.isNaN(tl_num_total)? '': tl_num_total;

      //pass_rate_color
      let pass_rate_color = ((tl_rate_1==colorConfigData.pass_rate.blue[1]/100)?"blue":
          ((tl_rate_1>colorConfigData.pass_rate.green[0]/100)||(tl_rate_1==colorConfigData.pass_rate.green[0]/100)?"green":
            (((tl_rate_1>colorConfigData.pass_rate.yellow[0]/100||tl_rate_1==colorConfigData.pass_rate.yellow[0]/100)&&
            (tl_rate_1<colorConfigData.pass_rate.yellow[1]/100||tl_rate_1==colorConfigData.pass_rate.yellow[1]/100))?"yellow":
              (tl_rate_1<colorConfigData.pass_rate.red[1]/100?"red":"")))

      );
      let test_norunrate_color = tl_rate_4==0.00?"green":(tl_rate_4>0.00?"red":"");

      this.setState({
        tl_num_total,
        tl_rate_1,
        tl_rate_2,
        tl_rate_3,
        tl_rate_4,
        tl_rate_total,
        pass_rate_color,test_norunrate_color
      });
    }
    //jira 参数
    if(['jira_num_1', 'jira_num_2', 'jira_num_3', 'jira_num_4'].includes(e.target.name)
        && this.state.jira_num_1 != undefined && this.state.jira_num_2 != undefined && this.state.jira_num_3 != undefined && this.state.jira_num_4 != undefined
    ){
      const {jira_num_1, jira_num_2, jira_num_3, jira_num_4, jira_close_num_1, jira_close_num_2, jira_close_num_3, jira_close_num_4,jira_close_num_total} = this.state;
      let jira_num_total = Number.parseInt(jira_num_1) + Number.parseInt(jira_num_2) + Number.parseInt(jira_num_3) + Number.parseInt(jira_num_4);
      let jira_repair_rate_1,jira_repair_rate_2,jira_repair_rate_3,jira_repair_rate_4,jira_repair_rate_total;
      if(jira_close_num_1 == 0 && jira_num_1 == 0){
        jira_repair_rate_1 = "1.00";
      }else{
        jira_repair_rate_1 = parseFloat(parseInt(jira_close_num_1) / parseInt(jira_num_1)).toFixed(2);
      }
      if(jira_close_num_2 == 0 && jira_num_2 == 0){
        jira_repair_rate_2 = "1.00";
      }else{
        jira_repair_rate_2 = parseFloat(parseInt(jira_close_num_2) / parseInt(jira_num_2)).toFixed(2);
      }
      if(jira_close_num_3 == 0 && jira_num_3 == 0){
        jira_repair_rate_3 = "1.00";
      }else{
        jira_repair_rate_3 = parseFloat(parseInt(jira_close_num_3) / parseInt(jira_num_3)).toFixed(2);
      }
      if(jira_close_num_4 == 0 && jira_num_4 == 0){
        jira_repair_rate_4 = "1.00";
      }else{
        jira_repair_rate_4 = parseFloat(parseInt(jira_close_num_4) / parseInt(jira_num_4)).toFixed(2);
      }
      if(jira_close_num_total == 0 && jira_num_total == 0){
        jira_repair_rate_total = "1.00";
      }else{
        jira_repair_rate_total= parseFloat(parseInt(jira_close_num_total) / parseInt(jira_num_total)).toFixed(2);
      }
      let b_repairrate_color = ((jira_repair_rate_1== 1.00)?"green":(jira_repair_rate_1<1.00?"red":""));
      let c_repairrate_color = ((jira_repair_rate_2== 1.00)?"green":(jira_repair_rate_2<1.00?"red":""));
      //mm_repaire_rate
      let major_repairrate_color = jira_repair_rate_3==colorConfigData.mm_repaire_rate.blue[1]/100?"blue":
        ( (jira_repair_rate_3>colorConfigData.mm_repaire_rate.green[0]/100 || jira_repair_rate_3==colorConfigData.mm_repaire_rate.green[0]/100)?"green":
          ( ((jira_repair_rate_3>colorConfigData.mm_repaire_rate.yellow[0]/100|| jira_repair_rate_3==colorConfigData.mm_repaire_rate.yellow[0]/100)&&
              jira_repair_rate_3<colorConfigData.mm_repaire_rate.yellow[1]/100))?"yellow":
               (jira_repair_rate_3<colorConfigData.mm_repaire_rate.red[1]/100?"red":"")
        ) ;
      let minor_repairrate_color = jira_repair_rate_4==colorConfigData.mm_repaire_rate.blue[1]/100?"blue":
        ( (jira_repair_rate_4>colorConfigData.mm_repaire_rate.green[0]/100 || jira_repair_rate_4==colorConfigData.mm_repaire_rate.green[0]/100)?"green":
            ( ((jira_repair_rate_4>colorConfigData.mm_repaire_rate.yellow[0]/100|| jira_repair_rate_4==colorConfigData.mm_repaire_rate.yellow[0]/100)&&
            jira_repair_rate_4<colorConfigData.mm_repaire_rate.yellow[1]/100))?"yellow":
              (jira_repair_rate_4<colorConfigData.mm_repaire_rate.red[1]/100?"red":"")
        ) ;


      this.setState({jira_num_total,jira_repair_rate_1,jira_repair_rate_2,jira_repair_rate_3,jira_repair_rate_4, jira_repair_rate_total,
                  b_repairrate_color,c_repairrate_color,major_repairrate_color,minor_repairrate_color,
      });
    }

    if(['jira_close_num_1', 'jira_close_num_2', 'jira_close_num_3', 'jira_close_num_4'].includes(e.target.name)
      && this.state.jira_close_num_1 != undefined && this.state.jira_close_num_2 != undefined && this.state.jira_close_num_3 != undefined && this.state.jira_close_num_4 != undefined
    ){
      // debugger;
      let {jira_num_1, jira_num_2, jira_num_3, jira_num_4, jira_num_total, jira_close_num_1, jira_close_num_2, jira_close_num_3, jira_close_num_4} = this.state;
      let jira_close_num_total = Number.parseInt(jira_close_num_1)+Number.parseInt(jira_close_num_2)+Number.parseInt(jira_close_num_3)+Number.parseInt(jira_close_num_4);
      let jira_repair_rate_1,jira_repair_rate_2, jira_repair_rate_3,jira_repair_rate_4, jira_repair_rate_total;
      if (jira_close_num_1 === "" || jira_num_1 === "" || jira_close_num_1 === null || jira_num_1 === null) {
        jira_repair_rate_1 = "";
      } else {
        if (jira_close_num_1 == 0 && jira_num_1 == 0) {
          jira_repair_rate_1 = "1.00";
        } else {
          if (parseInt(jira_close_num_1) > parseInt(jira_num_1)) {
            message.error("Block关闭数量不合理");
            jira_close_num_1 = "";
            this.setState({jira_close_num_1});
            jira_repair_rate_1 = "";
          } else {
            jira_repair_rate_1 = parseFloat(parseInt(jira_close_num_1) / parseInt(jira_num_1)).toFixed(2);
          }
        }
      }
      if (jira_close_num_2 === "" || jira_num_2 === "" || jira_close_num_2 === null || jira_num_2 === null) {
        jira_repair_rate_2 = "";
      } else {
        if (jira_close_num_2 == 0 && jira_num_2 == 0) {
          jira_repair_rate_2 = "1.00";
        } else {
          if (parseInt(jira_close_num_2) > parseInt(jira_num_2)) {
            message.error("Critical关闭数量不合理");
            jira_close_num_2 = "";
            this.setState({jira_close_num_2});
            jira_repair_rate_2 = "";
          } else {
            jira_repair_rate_2 = parseFloat(parseInt(jira_close_num_2) / parseInt(jira_num_2)).toFixed(2);
          }
        }
      }
      if (jira_close_num_3 === "" || jira_num_3 === "" || jira_close_num_3 === null || jira_num_3 === null) {
        jira_repair_rate_3 = "";
      } else {
        if (jira_close_num_3 == 0 && jira_num_3 == 0) {
          jira_repair_rate_3 = "1.00";
        } else {
          if (parseInt(jira_close_num_3) > parseInt(jira_num_3)) {
            message.error("Major关闭数量不合理");
            jira_close_num_3 = "";
            this.setState({jira_close_num_3});
            jira_repair_rate_3 = "";
          } else {
            jira_repair_rate_3 = parseFloat(parseInt(jira_close_num_3) / parseInt(jira_num_3)).toFixed(2);
          }
        }
      }
      if (jira_close_num_4 === "" || jira_num_4 === "" || jira_close_num_4 === null || jira_num_4 === null) {
        jira_repair_rate_4 = "";
      } else {
        if (jira_close_num_4 == 0 && jira_num_4 == 0) {
          jira_repair_rate_4 = "1.00";
        } else {
          if (parseInt(jira_close_num_4) > parseInt(jira_num_4)) {
            message.error("Minor关闭数量不合理");
            jira_close_num_4 = "";
            this.setState({jira_close_num_4});
            jira_repair_rate_4 = "";
          } else {
            jira_repair_rate_4 = parseFloat(parseInt(jira_close_num_4) / parseInt(jira_num_4)).toFixed(2);
          }
        }
      }
      if (jira_close_num_total === "" || jira_num_total === "" || jira_close_num_total === null || jira_num_total === null) {
        jira_repair_rate_total = "";
      } else {
        if (jira_close_num_total == 0 && jira_num_total == 0) {
          jira_repair_rate_total = "1.00";
        } else {
          if (parseInt(jira_close_num_total) > parseInt(jira_num_total)) {
            //message.error("Total关闭数量不合理");
            jira_close_num_total = "";
            this.setState({jira_close_num_total});
            jira_repair_rate_total = "";
          } else {
            jira_repair_rate_total = parseFloat(parseInt(jira_close_num_total) / parseInt(jira_num_total)).toFixed(2);
          }
        }
      }
      let b_repairrate_color = ((jira_repair_rate_1== 1.00)?"green":(jira_repair_rate_1<1.00?"red":""));
      let c_repairrate_color = ((jira_repair_rate_2== 1.00)?"green":(jira_repair_rate_2<1.00?"red":""));
      //mm_repaire_rate
      let major_repairrate_color = jira_repair_rate_3==colorConfigData.mm_repaire_rate.blue[1]/100?"blue":
        ( (jira_repair_rate_3>colorConfigData.mm_repaire_rate.green[0]/100 || jira_repair_rate_3==colorConfigData.mm_repaire_rate.green[0]/100)?"green":
            ( ((jira_repair_rate_3>colorConfigData.mm_repaire_rate.yellow[0]/100|| jira_repair_rate_3==colorConfigData.mm_repaire_rate.yellow[0]/100)&&
            jira_repair_rate_3<colorConfigData.mm_repaire_rate.yellow[1]/100))?"yellow":
              (jira_repair_rate_3<colorConfigData.mm_repaire_rate.red[1]/100?"red":"")
        ) ;
      let minor_repairrate_color = jira_repair_rate_4==colorConfigData.mm_repaire_rate.blue[1]/100?"blue":
        ( (jira_repair_rate_4>colorConfigData.mm_repaire_rate.green[0]/100 || jira_repair_rate_4==colorConfigData.mm_repaire_rate.green[0]/100)?"green":
            ( ((jira_repair_rate_4>colorConfigData.mm_repaire_rate.yellow[0]/100|| jira_repair_rate_4==colorConfigData.mm_repaire_rate.yellow[0]/100)&&
            jira_repair_rate_4<colorConfigData.mm_repaire_rate.yellow[1]/100))?"yellow":
              (jira_repair_rate_4<colorConfigData.mm_repaire_rate.red[1]/100?"red":"")
        ) ;
      this.setState({jira_close_num_total,jira_repair_rate_1, jira_repair_rate_2, jira_repair_rate_3,jira_repair_rate_4, jira_repair_rate_total,
              b_repairrate_color,c_repairrate_color,major_repairrate_color,minor_repairrate_color,
      });
    }
    //未有解决方案
    if(['jira_notfinish_num_1', 'jira_notfinish_num_2', 'jira_notfinish_num_3', 'jira_notfinish_num_4'].includes(e.target.name)
      && this.state.jira_notfinish_num_1 != undefined && this.state.jira_notfinish_num_2 != undefined && this.state.jira_notfinish_num_3 != undefined && this.state.jira_notfinish_num_4 != undefined
    ){
      const {jira_notfinish_num_1, jira_notfinish_num_2, jira_notfinish_num_3, jira_notfinish_num_4} = this.state;
      let jira_notfinish_num_total = Number.parseInt(jira_notfinish_num_1) + Number.parseInt(jira_notfinish_num_2) + Number.parseInt(jira_notfinish_num_3) + Number.parseInt(jira_notfinish_num_4);
      this.setState({jira_notfinish_num_total});
    }
    //兼容性测试结果
    // cptest_need cptest_final cptest_rate
    if(["cptest_need","cptest_final"].includes(e.target.name) && this.state.cptest_need!=undefined && this.state.cptest_final!=undefined){
      let {cptest_need, cptest_final} = this.state;
      let cptest_rate;
      if(parseInt(cptest_final) > parseInt(cptest_need)){
        message.error("实际测试>需要测试 的浏览器个数,不合理");
        cptest_final = "";
        this.setState({ cptest_final });
      }else{
        cptest_rate = parseFloat( parseInt(cptest_final)/parseInt(cptest_need) ).toFixed(2);
      }
      console.log(444444);
      let cptest_rate_color = cptest_rate==colorConfigData.cptest_rate.green[1]/100?"green":
            ( ((cptest_rate>colorConfigData.cptest_rate.yellow[0]/100|| cptest_rate==colorConfigData.cptest_rate.yellow[0]/100)&&
              cptest_rate<colorConfigData.cptest_rate.yellow[1]/100)?"yellow":
                (cptest_rate<colorConfigData.cptest_rate.red[1]/100?"red":"")
            ) ;
      this.setState({cptest_rate,
            cptest_rate_color
      });
    }
  }

  render() {
    //从准入报告列表页,解析传过来的url中的work_id参数
    let url = window.location.href;
    let obj = dealUrl(url);
    work_id = obj["work_id"];
    console.log(work_id);
    flag = obj["flag"];
    // console.log(flag);

    //下拉菜单 - menu - #弱网测试总结
    const dropData_weak = ["NA", "通过", "未通过"];
    const dropMenu_weak = (
      <Menu onClick={this.menuOnclick_weak.bind(this)}>
        <Menu.Item key={dropData_weak[0]}>
          <p>{dropData_weak[0]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_weak[1]}>
          <p>{dropData_weak[1]}</p>
        </Menu.Item>
        <Menu.Item key={dropData_weak[2]}>
          <p>{dropData_weak[2]}</p>
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
    //文件上传
    var _this = this;
    const props3 = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          test_result_filename = info.fileList[0].response.data.filename;
          console.log(test_result_filename);
          _this.setState({
            test_result_file:test_result_filename
          });
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    const props4 = {
      name: 'file',
      action: domain+'base/uploadfile/',
      headers: {
        authorization: 'authorization-text',
      },
      // listType:"picture",
      onChange(info) {
        if (info.file.status !== 'uploading') {
          uat_result_filename = info.fileList[0].response.data.filename;
          console.log(uat_result_filename);
          _this.setState({
            uat_result_file:uat_result_filename
          });
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={11}></Col>
          <Col span={6} className="title-txt">上线准入报告</Col>
        </Row>
        <div>
          <Row>
            <Col span={6} className="test-link-css border-right-css border-bottom-css">
              Testlink入参
            </Col>
            <Col span={18} className="test-link-css border-bottom-css">
              <Input placeholder="输入测试计划名称" name="tl_id" value={this.state.tl_id}
                     onChange={this.handleChange.bind(this)}
              />
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result border-right-css">
              测试用例结果分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>状态</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Pass</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Fail</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Block</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>NoRun</span></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <span>Total</span></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="tl_num_1" value={this.state.tl_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="tl_num_2" value={this.state.tl_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="tl_num_3" value={this.state.tl_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="tl_num_4" value={this.state.tl_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="tl_num_total" value={this.state.tl_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input style={{ backgroundColor: this.state.pass_rate_color}} type="number" placeholder="" name="tl_rate_1" value={this.state.tl_rate_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_2" value={this.state.tl_rate_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="" name="tl_rate_3" value={this.state.tl_rate_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input style={{ backgroundColor: this.state.test_norunrate_color }} type="number" placeholder="" name="tl_rate_4" value={this.state.tl_rate_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail">
                  <Input type="number" placeholder="" name="tl_rate_total" value={this.state.tl_rate_total} onChange={this.handleChange.bind(this)}/></Col>
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
              <Input placeholder="摘要中需求名称" name="jira_id" value={this.state.jira_id}/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result bug-analyse-css border-right-css">
              BUG分析
            </Col>
            <Col span={18}>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>严重级别</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Block</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Critical</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Major</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <span>Minor</span></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <span>Total</span></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_num_1" value={this.state.jira_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_num_2" value={this.state.jira_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_num_3" value={this.state.jira_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_num_4" value={this.state.jira_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_num_total" value={this.state.jira_num_total} onClick={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>关闭数量</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_close_num_1" value={this.state.jira_close_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_close_num_2" value={this.state.jira_close_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_close_num_3" value={this.state.jira_close_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="jira_close_num_4" value={this.state.jira_close_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_close_num_total" value={this.state.jira_close_num_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css"><span>修复比率(小数)</span></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input style={{ backgroundColor: this.state.b_repairrate_color }} type="number" placeholder="" name="jira_repair_rate_1" value={this.state.jira_repair_rate_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input style={{ backgroundColor: this.state.c_repairrate_color }} type="number" placeholder="" name="jira_repair_rate_2" value={this.state.jira_repair_rate_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input style={{ backgroundColor: this.state.major_repairrate_color }} type="number" placeholder="" name="jira_repair_rate_3" value={this.state.jira_repair_rate_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css border-bottom-css">
                  <Input style={{ backgroundColor: this.state.minor_repairrate_color }} type="number" placeholder="" name="jira_repair_rate_4" value={this.state.jira_repair_rate_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="" name="jira_repair_rate_total" value={this.state.jira_repair_rate_total} onChange={this.handleChange.bind(this)}/></Col>
              </Row>
              <Row>
                <Col span={4} className="test-result-detail border-right-css"><span>未有解决方案</span></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="*填入数量" name="jira_notfinish_num_1" value={this.state.jira_notfinish_num_1} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="*填入数量" name="jira_notfinish_num_2" value={this.state.jira_notfinish_num_2} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="*填入数量" name="jira_notfinish_num_3" value={this.state.jira_notfinish_num_3} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail border-right-css">
                  <Input type="number" placeholder="*填入数量" name="jira_notfinish_num_4" value={this.state.jira_notfinish_num_4} onChange={this.handleChange.bind(this)}/></Col>
                <Col span={4} className="test-result-detail">
                  <Input type="number" placeholder="" name="jira_notfinish_num_total" value={this.state.jira_notfinish_num_total} onChange={this.handleChange.bind(this)}/></Col>
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
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="cptest_need" value={this.state.cptest_need} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">实际测试的机型/浏览器</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input type="number" placeholder="*填入数量" name="cptest_final" value={this.state.cptest_final} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
              <Row>
                <Col span={18} className="test-result-detail border-right-css border-bottom-css">百分率</Col>
                <Col span={6} className="test-result-detail border-bottom-css">
                  <Input style={{ backgroundColor: this.state.cptest_rate_color }} type="number" placeholder="" name="cptest_rate" value={this.state.cptest_rate} onChange={this.handleChange.bind(this)}/>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">安全测试</Col>
            <Col span={18} className="test-result-detail border-bottom-css"
                 style={{ backgroundColor:(this.state.dropData_safe=="blue"?"blue":(this.state.dropData_safe=="green"?"green":(this.state.dropData_safe=="yellow"?"yellow":(this.state.dropData_safe=="red" || this.state.dropData_safe=="无"?"red":"white")))) }}
            >
              <span>{this.state.dropData_safe}</span>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">#弱网测试总结</Col>
            <Col span={9} className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
                 style={{ backgroundColor:(this.state.dropData_weak=="未通过" ? "red" : ((this.state.dropData_weak=="通过"||this.state.dropData_weak=="NA")?"green":"")) }}
            >
              <div>
                <Dropdown overlay={dropMenu_weak} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_weak}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={9} className="test-result-detail border-bottom-css">
              <Input placeholder="简单描述总结测试内容以及结果"/>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css border-bottom-css">测试报告结论</Col>
            <Col span={9} className="test-result-detail dropdown-list-css border-right-css border-bottom-css"
              style={{ backgroundColor:(this.state.dropData_test=="未通过" ? "red" : (this.state.dropData_test=="通过"?"green":"white")) }}
            >
              <div>
                <Dropdown overlay={dropMenu_test} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_test}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={9} className="test-result-detail border-bottom-css">
              <Upload {...props3}>
                <Button>
                  <Icon type="upload" /> 测试报告结论截图
                </Button>
              </Upload>
              <span>
                <a href={(this.state.test_result_file=="")?"":(domain+this.state.test_result_file)} target="_Blank">
                  {(this.state.test_result_file=="" || this.state.test_result_file=== null)?"":"查看测试报告结论截图"}</a>
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={6} className="test-result-detail border-right-css">UAT验收结论</Col>
            <Col span={9} className="test-result-detail dropdown-list-css border-right-css"
              style={{ backgroundColor:(this.state.dropData_UAT=="未通过" ? "red" : (this.state.dropData_UAT=="通过"?"green":"white")) }}
            >
              <div>
                <Dropdown overlay={dropMenu_UAT} trigger={["click"]}>
                  <a style={{color:"black"}} className="ant-dropdown-link" href="#">
                    {this.state.dropData_UAT}
                    <Icon type="down"/>
                  </a>
                </Dropdown>
              </div>
            </Col>
            <Col span={9} className="test-result-detail">
              <Upload {...props4}>
                <Button>
                  <Icon type="upload" /> UAT验收结论截图
                </Button>
              </Upload>
              <span>
                <a href={(this.state.uat_result_file=="")?"":(domain+this.state.uat_result_file)} target="_Blank">
                  {(this.state.uat_result_file=="" || this.state.uat_result_file=== null)?"":"查看UAT验收结论截图"}</a>
              </span>
            </Col>
          </Row>
        </div>

        <Row style={{ marginTop: 10 }}>
          <Col span={24}>
            注：最终结果取准入项中最低成绩，例如准入项中如果有一项为红灯，则整体结果为红灯; 所以只有当准入项均为绿灯时，整体才为绿灯;
            当整体结果为绿灯时，并且有至少一颗蓝灯则整体升级为蓝灯.

          </Col>
        </Row>

        <div style={{ display:(flag==0?"none":"block") }}>
          <Row className="jira-css row-btn-css">
            <Col span={12} className="look-result-btn">
              <Button style={{ display:"none"}}
                onClick={ ()=>{ window.location.href="index.html#/evaluationResult?flag=0&pageTag=online" }}
              >查看结果</Button>
            </Col>
            <Col span={24} className="submit-btn">
              <Button type="primary"
                      onClick={ ()=>{ 
                        //提交 上线报告信息
                        this.getIntFromString();
                        //文件上传
                        this.state.test_result_file = (test_result_filename==undefined)?"":test_result_filename;
                        this.state.uat_result_file = (uat_result_filename==undefined)?"":uat_result_filename;

                        // jira_id
                        let jira_id = this.state.jira_id;
                        if((typeof jira_id) == "object"){ // jira_id若为数组,则转换为字符串
                          jira_id = jira_id.join(",");
                        this.state.jira_id = jira_id;
                        }
                        console.log(this.state);

                        // debugger;
                        api.postOnlineReport(this.state).then(data=>{
                          console.log(data);
                          if(data.status == 200){
                            console.log("online report post success");
                            window.location.href="index.html#/evaluationResult?flag=1&pageTag=online&work_id="+ work_id
                          }else if(data.status == 500){
                            console.log(data.message);
                            alert(data.message);
                          }
                        });

                        } }
              >提交</Button>
            </Col>
          </Row>
        </div>

      </div>
    );
  }

  getIntFromString(){
    //安全测试
    if(this.state.dropData_safe == "无"){
      this.state.safetest_status = 0;
    }
    else if(this.state.dropData_safe == "blue"){
      this.state.safetest_status = 1;
    }else if(this.state.dropData_safe == "green"){
      this.state.safetest_status = 2;
    }else if(this.state.dropData_safe == "yellow"){
      this.state.safetest_status = 3;
    }else if(this.state.dropData_safe == "red"){
      this.state.safetest_status = 4;
    }
    //弱网测试总结  -- 待定
    if(this.state.dropData_weak == "NA"){
      this.state.rwtest_status = 0
    }else if(this.state.dropData_weak == "通过"){
      this.state.rwtest_status = 1
    }else if(this.state.dropData_weak == "未通过"){
      this.state.rwtest_status = 2
    }
    //测试报告结论
    if(this.state.dropData_test == "通过"){
      this.state.test_result = 1
    }else if(this.state.dropData_test == "未通过"){
      this.state.test_result = 0
    }
    //UAT验收结论
    if(this.state.dropData_UAT == "通过"){
      this.state.uat_result = 1
    }else if(this.state.dropData_UAT == "未通过"){
      this.state.uat_result = 0
    }
  }

  componentDidMount() {
    //获取平台的计算 “红、绿、黄、蓝” 颜色指标的配置
    api.getConfigOfColorStandard().then(data => {
      console.log(data);
      if(data.status === 200){
        colorConfigData = data.data[0].json.online_config;
        console.log(colorConfigData); // online_config

      }else{
        alert("请求颜色配置数据失败");
      }
    });

    //新建上线报告前,获取上线的jira数据
    api.getOnlineReport_Jira(work_id).then(data=> {
      console.log("online report get jira success");
      console.log(data);
      console.log(work_id);
      //将数据显示在页面上
      this.state = data.data;

      //pass_rate_color
      let pass_rate_color="",test_norunrate_color="",b_repairrate_color="",c_repairrate_color="",
        major_repairrate_color,minor_repairrate_color,cptest_rate_color;
      console.log(3333333);
      if(colorConfigData!=undefined){
        if(this.state.tl_rate_1!=null){
          pass_rate_color = ((this.state.tl_rate_1==colorConfigData.pass_rate.blue[1]/100)?"blue":
              ((this.state.tl_rate_1>colorConfigData.pass_rate.green[0]/100)||(this.state.tl_rate_1==colorConfigData.pass_rate.green[0]/100)?"green":
                (((this.state.tl_rate_1>colorConfigData.pass_rate.yellow[0]/100||this.state.tl_rate_1==colorConfigData.pass_rate.yellow[0]/100)&&
                (this.state.tl_rate_1<colorConfigData.pass_rate.yellow[1]/100||this.state.tl_rate_1==colorConfigData.pass_rate.yellow[1]/100))?"yellow":
                  (this.state.tl_rate_1<colorConfigData.pass_rate.red[1]/100?"red":"")))

          );
        }
        if(this.state.tl_rate_4!=null){
          test_norunrate_color = this.state.tl_rate_4==0.00?"green":(this.state.tl_rate_4>0.00?"red":"");
        }
        //修复比率-颜色判断
        if(this.state.jira_num_1==0 && this.state.jira_close_num_1==0){
          this.state.jira_repair_rate_1="1.00";
          b_repairrate_color = "green";
        }else{
          b_repairrate_color = ((this.state.jira_repair_rate_1== 1.00)?"green":(this.state.jira_repair_rate_1<1.00?"red":""));
        }
        if(this.state.jira_num_2==0 && this.state.jira_close_num_2==0){
          this.state.jira_repair_rate_2="1.00";
          c_repairrate_color = "green";
        }else{
          c_repairrate_color = ((this.state.jira_repair_rate_2== 1.00)?"green":(this.state.jira_repair_rate_2<1.00?"red":""));
        }
        if(this.state.jira_num_3==0 && this.state.jira_close_num_3==0) {
          this.state.jira_repair_rate_3 = "1.00";
          major_repairrate_color = "blue";
        }else{
          major_repairrate_color = this.state.jira_repair_rate_3==colorConfigData.mm_repaire_rate.blue[1]/100?"blue":
            ( (this.state.jira_repair_rate_3>colorConfigData.mm_repaire_rate.green[0]/100 || this.state.jira_repair_rate_3==colorConfigData.mm_repaire_rate.green[0]/100|| this.state.jira_repair_rate_3=="")?"green":
                ( ((this.state.jira_repair_rate_3>colorConfigData.mm_repaire_rate.yellow[0]/100|| this.state.jira_repair_rate_3==colorConfigData.mm_repaire_rate.yellow[0]/100)&&
                this.state.jira_repair_rate_3<colorConfigData.mm_repaire_rate.yellow[1]/100))?"yellow":
                  (this.state.jira_repair_rate_3<colorConfigData.mm_repaire_rate.red[1]/100?"red":"")
            ) ;
        }
        if(this.state.jira_num_4==0 && this.state.jira_close_num_4==0) {
          this.state.jira_repair_rate_4 = "1.00";
          minor_repairrate_color = "blue";
        }else{
          minor_repairrate_color = this.state.jira_repair_rate_4==colorConfigData.mm_repaire_rate.blue[1]/100?"blue":
            ( (this.state.jira_repair_rate_4>colorConfigData.mm_repaire_rate.green[0]/100 || this.state.jira_repair_rate_4==colorConfigData.mm_repaire_rate.green[0]/100|| this.state.jira_repair_rate_4=="")?"green":
                ( ((this.state.jira_repair_rate_4>colorConfigData.mm_repaire_rate.yellow[0]/100|| this.state.jira_repair_rate_4==colorConfigData.mm_repaire_rate.yellow[0]/100)&&
                this.state.jira_repair_rate_4<colorConfigData.mm_repaire_rate.yellow[1]/100))?"yellow":
                  (this.state.jira_repair_rate_4<colorConfigData.mm_repaire_rate.red[1]/100?"red":"")
            ) ;
        }
        if(this.state.jira_num_total==0 && this.state.jira_close_num_total==0){
          this.state.jira_repair_rate_total = "1.00";
        }
        if(this.state.cptest_rate!=null){
          cptest_rate_color = this.state.cptest_rate==colorConfigData.cptest_rate.green[1]/100?"green":
            ( ((this.state.cptest_rate>colorConfigData.cptest_rate.yellow[0]/100|| this.state.cptest_rate==colorConfigData.cptest_rate.yellow[0]/100)&&
              this.state.cptest_rate<colorConfigData.cptest_rate.yellow[1]/100)?"yellow":
                (this.state.cptest_rate<colorConfigData.cptest_rate.red[1]/100?"red":"")
            ) ;
        }
      }else{
        alert("获取颜色配置数据失败");
      }

      /*
        将int类型的状态数据,转换成对应的字符串类型
      */
      
      /*//安全测试 状态
      safeSta = this.state.safetest_status;
      if(safeSta == 1){
        this.setState({dropData_safe:"蓝灯"});
      }else if(safeSta ==2){
        this.setState({dropData_safe:"绿灯"});
      }else if(safeSta ==3){
        this.setState({dropData_safe:"黄灯"});
      }else if(safeSta ==4){
        this.setState({dropData_safe:"红灯"});
      }else{
        this.setState({dropData_safe:"未选择"});
      }*/
      //弱网测试 状态
      weakSta = this.state.rwtest_status;
      if( weakSta == 1 ){
        this.setState({ dropData_weak:"通过" });
      }else if( weakSta == 2 ){  // --- 还需验证"弱网测试"的字段设计,接口中设计的有问题 - 2017.04.26
        this.setState({ dropData_weak:"未通过" });
      }else{ // 0
        this.setState({ dropData_weak:"NA" });
      }
      //测试报告结论 状态
      testSta = this.state.test_result;
      //UAT验收结论 状态
      UATSta = this.state.uat_result;
      this.setState({
        //颜色显示
        pass_rate_color,test_norunrate_color,
        b_repairrate_color,c_repairrate_color,major_repairrate_color,minor_repairrate_color,cptest_rate_color,
        dropData_test:(testSta == 1)?"通过":"未通过" ,
        dropData_UAT:(UATSta == 1)?"通过":"未通过",
        work_id:work_id,
      });
      console.log(this.state);

      //获取安全测试结果 -- 需要的参数 jira_id
      let arr_jira_id = [], //参数为string数组
        jira_id;
      jira_id = this.state.jira_id;
      console.log(jira_id);
      if(jira_id != undefined){
        arr_jira_id.push(jira_id);
        if(jira_id.includes(",")){
          arr_jira_id = [];
          arr_jira_id = jira_id.split(",");
        }
      }
      //发送请求 -- 获取安全测试结果
      api.getSafeTestResult(arr_jira_id).then(data => {
        console.log(data);
        if(data.status == 200){
          data.data.map(ele => {
            if(ele.status == 200){
              console.log(ele.result); // 蓝/绿/黄/红
              this.setState({
                dropData_safe : ele.result,
              });
            }

            if(this.state.dropData_safe === undefined){
              if (ele.status == 404) {
                console.log(ele.msg);
                this.setState({
                  dropData_safe: "无"
                });
              }
            }
          });
        }
      });

    });
  }
}