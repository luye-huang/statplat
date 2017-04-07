/**
 * Created by luye on 07/04/2017.
 */
import React from 'react';
import JsonEditor from './luyeJsonEditor/luyeJsonEditor';
export default class Settings extends React.Component{
  render(){
    return(
      <div id="json-editor"></div>
    );
  }
  componentDidMount(){
    const param = {
      dom: document.getElementById('json-editor')
    };
    const editor = new JsonEditor(param);
  }
}