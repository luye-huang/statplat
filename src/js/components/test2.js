/**
 * Created by edz on 17/4/6.
 */
import React , {Component} from "react";

import {
    Layout,Breadcrumb,
    Button ,
    Menu,
    Dropdown,
    Icon,
    Row, Col,
    Tabs

} from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function handleMenuClick(e) {
    console.log('click', e);
}

/*const menu = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">1st item</Menu.Item>
        <Menu.Item key="2">2nd item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
);*/

const DemoBox = props => <p className={`height-${props.value}`}>{props.children}</p>;

//下拉菜单
const dropMenu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">1st menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">2nd menu item</a>
        </Menu.Item>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">3d menu item</a>
        </Menu.Item>
    </Menu>
);

//Tabs标签页
const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}

export default class test2 extends Component{

    //button
    /*render(){
        return(
            <div>
                <Button type="primary">Primary</Button>
                <Button>Default</Button>
                <Button type="dashed">Dashed</Button>
                <Button type="danger">Danger</Button>
            </div>
        );
    }*/

    //circle button
    /*render(){
        return(
            <div>
                <Button type="primary" shape="circle" icon="search" />
                <Button type="primary" icon="search">Search</Button>
                <Button shape="circle" icon="search" />
                <Button icon="search">Search</Button>
                <br />
                <Button shape="circle" icon="search" />
                <Button icon="search">Search</Button>
                <Button type="dashed" shape="circle" icon="search" />
                <Button type="dashed" icon="search">Search</Button>
            </div>
        );
    }*/

    //Multiple Buttons
    /*render(){
        return(
            <div>
                <Button type="primary">primary</Button>
                <Button>secondary</Button>
                <Dropdown overlay={menu}>
                    <Button>
                        more <Icon type="down" />
                    </Button>
                </Dropdown>
            </div>
        );
    }*/

    //icon
    /*render(){
        return(
            <Icon type="apple-o" />
        );
    }*/

    //grid
    /*render(){
        return(
            <div>
                <Row>
                    <Col span={8}>col-8</Col>
                    <Col span={8}>col-8</Col>
                    <Col span={8}>col-8</Col>
                </Row>
                <Row>
                    <Col span={6}>
                        col-6<Button type="primary">保存</Button>
                    </Col>
                    <Col span={6}>
                        col-6<Button type="primary">新建</Button>
                    </Col>
                    <Col span={6}>
                        col-6
                    </Col>
                    <Col span={6}>
                        col-6
                    </Col>
                </Row>
            </div>
        );
    }*/

    //grid sort
    /*render(){
        return(
            <Row>
                <Col
                    style={{border:"1px red solid",borderLeft:"none"}}
                    span={18} push={6}
                >col-18 col-push-6</Col>
                <Col style={{border:"1px red solid"}} span={6} pull={18}>col-6 col-pull-18</Col>
            </Row>
        );
    }*/

    //Flex Layout
    /*render(){
        let styleCss = {
            rowCss : {
                border:"1px blue solid",
                height:"30px",
            },
            colCss : {
                border:"1px red solid"
            }
        };

        return(
            <div>
                <p>sub-element align left</p>
                <Row style={styleCss.rowCss} type="flex" justify="start">
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                </Row>

                <p>sub-element align center</p>
                <Row style={styleCss.rowCss} type="flex" justify="center">
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                </Row>

                <p>sub-element align right</p>
                <Row style={styleCss.rowCss} type="flex" justify="end">
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                    <Col span={4}>col-4</Col>
                </Row>

                <p>sub-element monospaced arrangement</p>
                <Row style={styleCss.rowCss} type="flex" justify="space-between">
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                </Row>

                <p>sub-element align full</p>
                <Row style={styleCss.rowCss} type="flex" justify="space-around">
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                    <Col style={styleCss.colCss} span={4}>col-4</Col>
                </Row>
            </div>
        );
    }*/

    //Flex Alignment
    /*render(){
        return(
            <div>
                <p>Align Top</p>
                <Row type="flex" justify="center" align="top">
                    <Col style={{backgroundColor:"pink"}} span={4}><DemoBox value={100}>col-4</DemoBox></Col>
                    <Col style={{backgroundColor:"pink"}} span={4}><DemoBox value={50}>col-4</DemoBox></Col>
                    <Col style={{backgroundColor:"pink"}} span={4}><DemoBox value={120}>col-4</DemoBox></Col>
                    <Col style={{backgroundColor:"pink"}} span={4}><DemoBox value={80}>col-4</DemoBox></Col>
                </Row>

                <p>Align Center</p>
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={4}><DemoBox value={100}>col-4</DemoBox></Col>
                    <Col span={4}><DemoBox value={50}>col-4</DemoBox></Col>
                    <Col span={4}><DemoBox value={120}>col-4</DemoBox></Col>
                    <Col span={4}><DemoBox value={80}>col-4</DemoBox></Col>
                </Row>

                <p>Align Bottom</p>
                <Row type="flex" justify="space-between" align="bottom">
                    <Col span={4}><DemoBox value={100}>col-4</DemoBox></Col>
                    <Col span={4}><DemoBox value={50}>col-4</DemoBox></Col>
                    <Col span={4}><DemoBox value={120}>col-4</DemoBox></Col>
                    <Col span={4}><DemoBox value={80}>col-4</DemoBox></Col>
                </Row>
            </div>
        );
    }*/

    //Dropdown下拉菜单
    /*render(){
        return(
            <Dropdown overlay={dropMenu}>
                <a className="ant-dropdown-link" href="#">
                    Hover me <Icon type="down" />
                </a>
            </Dropdown>
        );
    }*/

    //Tabs标签页
   /*render(){
       return(
           <Tabs defaultActiveKey="1" onChange={callback}>
               <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
               <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
               <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
           </Tabs>


           /!*<Tabs onChange={callback} type="card">
               <TabPane tab="Tab 1" key="1">Content of Tab Pane 1</TabPane>
               <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
               <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
           </Tabs>*!/
       );
   }*/
    
    //
    render(){
        return(
            <Layout>
                <Header className="header">
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content style={{ padding: '0 50px' }}>
                    <Breadcrumb style={{ margin: '12px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Sider width={200} style={{ background: '#fff' }}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={['1']}
                                defaultOpenKeys={['sub1']}
                                style={{ height: '100%' }}
                            >
                                <SubMenu key="sub1" title={<span><Icon type="user" />subnav 1</span>}>
                                    <Menu.Item key="1">option1</Menu.Item>
                                    <Menu.Item key="2">option2</Menu.Item>
                                    <Menu.Item key="3">option3</Menu.Item>
                                    <Menu.Item key="4">option4</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub2" title={<span><Icon type="laptop" />subnav 2</span>}>
                                    <Menu.Item key="5">option5</Menu.Item>
                                    <Menu.Item key="6">option6</Menu.Item>
                                    <Menu.Item key="7">option7</Menu.Item>
                                    <Menu.Item key="8">option8</Menu.Item>
                                </SubMenu>
                                <SubMenu key="sub3" title={<span><Icon type="notification" />subnav 3</span>}>
                                    <Menu.Item key="9">option9</Menu.Item>
                                    <Menu.Item key="10">option10</Menu.Item>
                                    <Menu.Item key="11">option11</Menu.Item>
                                    <Menu.Item key="12">option12</Menu.Item>
                                </SubMenu>
                            </Menu>
                        </Sider>
                        <Content style={{ padding: '0 24px', minHeight: 280 }}>
                            Content
                        </Content>
                    </Layout>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2016 Created by Ant UED
                </Footer>
            </Layout>
        );
    }



}



