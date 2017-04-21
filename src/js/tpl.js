import React from 'react';
import {Link} from 'react-router';
import 'antd/dist/antd.less';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

export default class Template extends React.Component {
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo"/>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['2']}
            style={{lineHeight: '64px'}}
          >
          </Menu>
        </Header>
        <Layout>
          <Sider width={200} style={{background: '#fff'}}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['1']}
              defaultOpenKeys={['sub1']}
              style={{height: '100%'}}
            >
              <SubMenu key="sub1" title={<span><Icon type="user"/>subnav1</span>}>
                <Menu.Item key="1">option1<Link to={`/essence`}/></Menu.Item>
                <Menu.Item key="2">option2<Link to={`/essence1`}/></Menu.Item>
                <Menu.Item key="3">option3<Link to={`/option3`}/></Menu.Item>
                <Menu.Item key="4">option4<Link to={`/test2`}/></Menu.Item>
              </SubMenu>

              <Menu.Item key="5">准入报告列表<Link to={`/reportList`}/></Menu.Item>
              <Menu.Item key="6">月度统计表<Link to={`/monthStat`}/></Menu.Item>
              <Menu.Item key="7">新建提测准入报告<Link to={`/newCheckInReport`}/></Menu.Item>
              <Menu.Item key="8">新建上线准入报告<Link to={`/newOnlineReport`}/></Menu.Item>
              <Menu.Item key="9">新建合版准入报告<Link to={`/newMergeReport`}/></Menu.Item>

              <Menu.Item key="1">配置管理<Link to={`/settings`}/></Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{padding: '0 24px 24px'}}>
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
              Content
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

