/**
 * Created by luye on 10/05/2017.
 */
import React from 'react';
import {Icon, Menu, Dropdown, message} from 'antd';


export default class DepartmentList extends React.Component {
  constructor() {
    super();
  }

  render() {
    console.log(this.props.list);
    this.props.list && !this.props.list.some((item)=>item.id === 0) && this.props.list.push({id: 0, name: '全部'});
    function handleButtonClick(e) {
      // message.info('Click on left button.');
      console.log('click left button', e);
    }
    
    let defaultItem;
    if (this.props.layer === 1) {
      defaultItem = this.props.selected || '一级部门';
    }
    else if (this.props.layer === 2) {
      defaultItem = this.props.selected || '二级部门';
    }
    else if (this.props.layer === 3) {
      defaultItem = this.props.selected || '三级部门';
    }
    let overlay = this.props.list ? (
      <Menu onClick={this.props.changeSubDep}>
        {this.props.list.map((item)=> {
          console.log(item);
          return (
            <Menu.Item key={item.id + '@' + item.name + '@' + this.props.layer}>
              {item.name}
            </Menu.Item>)
        })}
      </Menu>
    ) : null;
    return (
      <div>
        <Dropdown overlay={overlay} onClick={handleButtonClick} trigger={["click"]}>
          <a className="ant-dropdown-link" href="#">
            {defaultItem}
            <Icon type="down"/>
          </a>
        </Dropdown>
      </div>
    );
  }
}