import React from 'react';
// var footerCss = require("../../css/footer.css");
var footerCss = require("../../css/footer.css");
// import '../../css/footer.css';
export default class ComponentFooter extends React.Component{
  render(){
    // console.log(footerCss);
    return(
      <footer class={footerCss.miniFooter}>
        <h1>this is footer</h1>
      </footer>
    )
  }
}
