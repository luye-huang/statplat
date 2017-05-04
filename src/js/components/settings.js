/**
 * Created by luye on 07/04/2017.
 */
import React from 'react';
import JsonEditor from './luyeJsonEditor/luyeJsonEditor';
import {api} from '../api';
export default class Settings extends React.Component{
  render(){
    return(
      <div id="json-editor"></div>
    );
  }
  componentDidMount(){
    api.getManageConfig().then(data=>{
      console.log(data);
      const dataSource = JSON.parse(data.data.json);
      console.log(dataSource);
      const param = {
        dom: document.getElementById('json-editor'),
        data: dataSource,
        submit: function(){
          console.log(this);
        }
      };
      const editor = new JsonEditor(param);
    });
  }
}