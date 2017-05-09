import React from 'react';
import {Link} from 'react-router';
import 'antd/dist/antd.less';
import '../less/tpl.less';
import {Layout, Menu, Breadcrumb, Icon} from 'antd';
import {api} from "./api.js";
const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;

export default class Template extends React.Component {

  constructor() {
    super();
    this.state = {
      uid: '',
      pwd: '',
      logined: localStorage.getItem('uid') ? true : false
    }
  }

  componentWillMount() {
    const state = this.state;
    const that = this;
    const proxyLogin = new Proxy(localStorage, {
      set: function(target, propkey, value){
        if(propkey === 'add'){
          target.setItem('uid', value.uid);
          target.setItem('pwd', value.pwd);
        }
      }
    });
    console.log(localStorage);
    let token = 'huangluye' + ':' + 'wd123456';
    const buf = new Buffer(token);
    token = buf.toString('base64');
    const param = {
      uid: 'huangluye',
      pwd: 'wd123456',
      authorization: 'Basic ' + token
    }
    api.postLogin(param).then(data=> {
      if (Object.is(data.message, 'OK')) {
        proxyLogin.add = {
          uid: 'huang',
          pwd: 'wd123456'
        };
        // localStorage.setItem('uid', this.state.uid);
        // localStorage.setItem('pwd', this.state.pwd);
        // this.state.logined = true;
      }
    });
  }

  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="logo"></div>
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
              {/*<SubMenu key="sub1" title={<span><Icon type="user"/>subnav1</span>}>*/}
              {/*<Menu.Item key="1">option1<Link to={`/essence`}/></Menu.Item>*/}
              {/*<Menu.Item key="2">option2<Link to={`/essence1`}/></Menu.Item>*/}
              {/*</SubMenu>*/}

              <Menu.Item key="5">准入报告列表<Link to={`/reportList`}/></Menu.Item>
              <Menu.Item key="6">月度统计表<Link to={`/monthStat`}/></Menu.Item>
              <Menu.Item key="1">配置管理<Link to={`/settings`}/></Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{padding: '0 24px 24px'}}>
            <Content style={{background: '#fff', padding: 24, margin: 0, minHeight: 280}}>
              {this.props.children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

