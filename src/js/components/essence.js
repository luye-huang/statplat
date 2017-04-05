/**
 * Created by luye on 29/03/2017.
 */
import React from 'react';
import {MockApi} from '../mock';
import {str} from '../mock';
import {Row, Col, Button} from 'antd';
// import '../../css/style.less';
export default class Essence extends React.Component {
  render() {
    console.log(MockApi.getListMock());
    console.log(str);
    return (
      <div>
        <Row gutter={16}>
          <Col span={6}>ss</Col>
          <Col span={6}>s</Col>
          <Col span={6}>s</Col>
          <Col span={6}>s</Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>ss</Col>
          <Col span={6}>s</Col>
          <Col span={6}>s</Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>ss</Col>
          <Col span={6}><Button type="primary">新建</Button></Col>
          <Col span={6}><Button type="primary">查询</Button></Col>
          <Col span={6}>s</Col>
        </Row>
        <div id="tb-div"></div>
      </div>
    )
  }
}
