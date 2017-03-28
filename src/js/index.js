var React = require('react');
var ReactDOM = require('react-dom');
var $ = require('jquery');
import ComponentHeader from './components/header';
import ComponentFooter from './components/footer';
import BodyIndex from './components/bodyIndex';
import LuyeTable from './components/luyeTable/luyeTable';
import 'antd/dist/antd.css';
export default class Index extends React.Component{
  render(){

    return(   //return only one dom
      <div>
        <ComponentHeader/>
        <BodyIndex id={250} />
        <div>
					{this.props.children}
				</div>
        <div id="tb-div"></div>
        <ComponentFooter/>
      </div>
    )
  }
  componentDidMount(){
    let tb = new LuyeTable({
      el:$('#tb-div'),
      columns : [{cname : '团队名称', cdata : 'tname', action:'click'},
        {cname : '代码行总数', cdata : 'code_count', style:'hide'},
        {cname : '提交文件总数', cdata : 'file_count', action:'click'},
        {cname : '团队总得分', cdata : 'tscore'}]
    })
  }
}
