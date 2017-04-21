/**
 * Created by luye on 07/04/2017.
 */
import React from 'react';
import JsonEditor from './luyeJsonEditor/luyeJsonEditor';
import {api} from '../api';
const $ = require('jquery');
export default class Settings extends React.Component{
  render(){

    return(
      <div id="json-editor"></div>
    );
  }
  componentDidMount(){
    api.postWorkflowWork().then(data=>console.log(data));
    // api.getManageConfig().then(data=>{
    //   console.log(data);
    //   const dataSource = JSON.parse(data.data.json);
    //   const param = {
    //     dom: document.getElementById('json-editor')
    //   };
    //   // const editor = new JsonEditor(param);
    // });
    // api.postWorkflowCheckMerge(1,'huangliang23',1,'通过','').then(data=>{
    //   console.log(data);
    // });
    // api.postWorkflowCheckReportOnline(1,'huangliang23',1,'通过','').then(data=>{
    //   console.log(data);
    // });

    $.ajax(
      {
        type: 'post',
        url: 'http://aeplat.intra.ffan.com/workflow/work/',
        dataType:'json',
        data: {
          name: "非app类测试项目2",
          type: 1,
          jira_id: "EE-203",
          date_begin: "2017-4-20",
          date_end: "2017-4-21"
        },
        error:function (data) {
          console.log(data.status);
          console.log(data.statusText);
          console.log(data.responseText);
        },
        success:function (data) {
          console.log('success');
          console.log(data);
        }
      }
    ).then(function () {
      console.log('hehe');
    });
    // $.post("http://aeplat.intra.sit.ffan.com/workflow/checkreport/online",{
    //   work_id: 1,
    //   reporter_ctx:'huangliang23',
    //   if_pass:1,
    //   comment:'',
    //   file:''
    // },function(result){
    //   $("span").html(result);
    // });
  }
}