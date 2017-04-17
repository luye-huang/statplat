/**
 * Created by yang on 17/4/7.
 */
import React , {Component} from "react";
import { DatePicker } from 'antd';
import moment from 'moment';
import {
    Layout, Menu,
    Breadcrumb, Icon,
    Row, Col,
    Dropdown,
    Modal, Button,
    Table,
} from 'antd';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

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

//table表格
const columns = [{
    title: 'Name',
    dataIndex: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Age',
    dataIndex: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
}];
const data = [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
}, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
}, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
}, {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sidney No. 1 Lake Park',
}];

// rowSelection object indicates the need for row selection
const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
};


class option3 extends Component {
    //modal对话框 - 初始化, 下拉列表 - 显示数据-初始化
    constructor(props){
        super();
        this.state = {
            loading: false,
            visible: false,
            dropData:"下拉列表",
        }
    }

    //下拉列表-事件处理
    menuOnclick(e) {
        console.log('click', e.key);
        this.setState({
            dropData:e.key,
        });
    }

    //modal对话框 -- 在使用过程中,需要将ant design例子中的箭头函数,改为常规函数,并且在绑定事件时需要bind(this).
    showModal (){
        this.setState({
            visible: true,
        });
    }
    handleOk (){
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({ loading: false, visible: false });
        }, 500);
    }
    handleCancel (){
        this.setState({ visible: false });
    }

    render(){
        //当前时间
        let currDate = new Date();
        let currTime = getNowTime(currDate);

        //下拉菜单 - menu
        const dropData = ["列表项1","列表项2","列表项3"];
        const dropMenu = (
            <Menu onClick={this.menuOnclick.bind(this)} >
                <Menu.Item key={dropData[0]}>
                    <p>{dropData[0]}</p>
                </Menu.Item>
                <Menu.Item key={dropData[1]}>
                    <p>{dropData[1]}</p>
                </Menu.Item>
                <Menu.Item key={dropData[2]}>
                    <p>{dropData[2]}</p>
                </Menu.Item>
            </Menu>
        );

        return(
            <div>
                <Row>
                    <Col span={8}>
                        <Dropdown overlay={dropMenu} trigger={["click"]}>
                            <a className="ant-dropdown-link" href="#">
                                {this.state.dropData}
                                <Icon type="down" />
                            </a>
                        </Dropdown>
                    </Col>
                    <Col span={4}>
                        日期选择:
                    </Col>
                    <Col span={12}>
                        <div>
                            <DatePicker defaultValue={moment(currTime)} onChange={onChange} />
                            <br /><br />

                            <RangePicker onChange={onChange} />
                        </div>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col span={24}>
                        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
                    </Col>
                </Row>

                <Row style={{marginTop:"20px"}}>
                    <Col span={6}>
                        <div>
                            <Button type="primary" onClick={this.showModal.bind(this)}>
                                提交
                            </Button>
                            <Modal
                                visible={this.state.visible}
                                title="信息确认"
                                onOk={this.handleOk.bind(this)}
                                onCancel={this.handleCancel.bind(this)}
                                footer={[
                                    <Button key="back" size="large" onClick={this.handleCancel.bind(this)}>返回</Button>,
                                    <Button key="submit" type="primary" size="large" loading={this.state.loading} onClick={this.handleOk.bind(this)}>
                                      确认
                                    </Button>,
                                ]}
                            >
                                <p>请问</p>
                                <p>是否确认提交吗?</p>
                            </Modal>
                        </div>
                    </Col>
                </Row>
            </div>

        );
    }

    componentDidMount(){

    }
}

export default option3;

