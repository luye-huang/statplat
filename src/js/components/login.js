/**
 * Created by luye on 09/05/2017.
 */
import React from 'react';
import {api} from "../api.js";
import '../../less/login.less'
export default class Login extends React.Component {
  constructor() {
    super();
  }

  login(e) {
    const proxyLogin = new Proxy(localStorage, {
      set: function (target, propkey, value) {
        if (propkey === 'add') {
          target.setItem('uid', value.uid);
          target.setItem('pwd', value.pwd);
        }
        return true;
      }
    });
    console.log(localStorage);
    let param = {};
    Array.from(e.target.parentElement.querySelectorAll('input'), function (item) {
      if (param.uid === undefined) {
        param.uid = item.value;
      }
      else {
        param.pwd = item.value;
      }
    });
    let token = param.uid + ':' + param.pwd;
    const buf = new Buffer(token);
    token = buf.toString('base64');
    param.authorization = 'Basic ' + token;
    api.postLogin(param).then(data=> {
      if (Object.is(data.message, 'OK')) {
        proxyLogin.add = {
          uid: param.uid,
          pwd: param.pwd
        };
        window.location.href = "index.html#/";
      }
      else {
        proxyLogin.add = {
          uid: '',
          pwd: ''
        };
      }
    });
  }

  render() {
    return (
      <div>
        用户名:<br/>
        <input type="text"/>
        <br/>
        密码:<br/>
        <input type="password"/>
        <br></br>
        <button onClick={this.login}>提交</button>
      </div>
    )
  }
}