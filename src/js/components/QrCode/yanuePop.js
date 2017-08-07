
const $ = require('jquery');

export const Img ="http://nres.ffan.com/newh5/7fcbca6e40022ed873fd7248b4716afd6f48ffce/diaoyan-zhiliang/zhiliangpingtaidiaoyan.jpg" 
export const Href = "https://sojump.com/jq/15645127.aspx";

(function () {
  function Pop(title,url,intro){
    this.title = title;
    this.url = url;
    this.intro = intro;
    this.apearTime = 1000;
    this.hideTime = 500;
    this.delay = 10000;
    //添加信息
    this.addInfo();
    //显示
    this.showDiv();
    //关闭
    this.closeDiv();
  }

  Pop.prototype={
    addInfo:function(){
      $("#popTitle a").attr('href',this.url).html(this.title);
      $("#popIntro").html(this.intro);
      $("#popMore a").attr('href',this.url);
    },
    showDiv:function(time){
      // if (!($.browser.msie && ($.browser.version == "6.0") && !$.support.style)) {
      if (!($.support.msie && ($.support.version == "6.0") && !$.support.style)) {
        $('#pop').slideDown(this.apearTime).delay(this.delay).fadeOut(400);;
      } else{//调用jquery.fixed.js,解决ie6不能用fixed
        $('#pop').show();
        jQuery(function($j){
          $j('#pop').positionFixed()
        })
      }
    },
    closeDiv:function(){
      $("#popClose").click(function(){
          $('#pop').hide();
        }
      );
    }
  }
  window.Pop = Pop;
})();

  
  


