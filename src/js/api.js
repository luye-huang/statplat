/**
 * Created by luye on 19/04/2017.
 */
import $ from "jquery";
export const domain = 'http://aeplat.intra.sit.ffan.com/';

export const api = {
  //login
  postLogin(obj){
    let url = domain+"auth/login/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },


  //获取 配置管理信息 manager/config
  getManageConfig(){
    return fetch(domain+'manager/config').then(response => response.json());
  },

  //提交 配置管理接口 manager/config/
  postManagerConfig(obj){
    let url = domain+"manager/config/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },


  //提交 项目信息 workflow/work/  -- OK
  postNewProject(obj){
    let url = domain+"workflow/work/";
    return $.ajax({
        type:"post",
        url:url,
        dataType:"json",
        data:obj,
        error:function (data) {
          console.log(data.status);
          console.log(data.statusText);
          console.log(data.responseText);
        },
        success:function (data) {
          console.log("success");
          console.log(data);
        }
      });
  },

  //获取 新建项目信息 -- OK
  getNewProject(id){
    let url = domain+"workflow/work?id="+ id;
    return fetch(url).then( response=> response.json() );
  },

  //获取 准入报告列表信息 -- OK
  getReportList(obj){
    let url = domain+"workflow/list/?date_begin="+obj.date_begin+"&date_end="+obj.date_end+"&check_result="+obj.check_result
    return fetch(url).then( response => response.json() );
  },

  /*
    提测报告
     get workflow/report/checkin/?work_id=5
     post workflow/report/checkin/
     get workflow/checkreport/checkin/?work_id=1
     post workflow/checkreport/checkin/
   */
  //获取 新建提测报告前,获取提测的jira数据 / 获取 提测报告的信息  -- OK
  getCheckinReport_Jira(work_id){
    let url = domain+"workflow/report/checkin/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交提测报告 workflow/report/checkin/  -- 404 not found
  postCheckinReport(obj){
    let url = domain+"workflow/report/checkin/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },

  //获取 查看提测报告的 评估结果  -- OK
  getCheckreportForCheckin(work_id){
    let url = domain+"workflow/checkreport/checkin?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交提测报告审核信息 workflow/checkreport/checkin/  -- -- OK
  postCheckreportForCheckin(obj){
    let url = domain+"workflow/checkreport/checkin/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },

  /*
    合板报告
     get workflow/report/merge/?work_id=7
     post workflow/report/merge/
     get workflow/checkreport/merge/?work_id=7
     post workflow/checkreport/merge/
   */
  //获取 新建合板报告前,获取合板的jira数据 /  -- OK
  getMergeReport_Jira(work_id){
    let url = domain+"workflow/report/merge/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交合板报告 workflow/report/merge/  -- -- OK
  postMergeReport(obj){
    let url = domain+"workflow/report/merge/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },

  //获取 查看合板报告的 评估结果  -- OK
  getCheckreportForMerge(work_id){
    let url = domain+"workflow/checkreport/merge?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交合版报告审核信息 workflow/checkreport/merge/   -- OK
  postCheckreportForMerge(obj){
    let url = domain+"workflow/checkreport/merge/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },

  /*
    上线报告
    get workflow/report/online/?work_id=8
    post workflow/report/online/
    get workflow/checkreport/online/?work_id=8
    post workflow/checkreport/online/
   */
  //获取 新建上线报告前,获取上线的jira数据 / 获取 上线报告的信息  -- OK
  getOnlineReport_Jira(work_id){
    let url = domain+"workflow/report/online/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交上线报告 workflow/report/online/    -- -- OK
  postOnlineReport(obj){
    let url = domain+"workflow/report/online/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },

  //获取 查看上线报告的 评估结果  -- OK
  getCheckreportForOnline(work_id){
    let url = domain+"workflow/checkreport/online/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交上线报告审核信息 workflow/checkreport/online/   -- -- OK
  postCheckreportForOnline(obj){
    let url = domain+"workflow/checkreport/online/";
    return $.ajax({
      type:"post",
      url:url,
      dataType:"json",
      data:obj,
      error:function (data) {
        console.log(data.status);
        console.log(data.statusText);
        console.log(data.responseText);
      },
      success:function (data) {
        console.log("success");
        console.log(data);
      }
    });
  },

  //月度统计表  stat/list  - - OK
  getMonthStatList(obj){
    let url = domain+"stat/list/?date_begin="+obj.date_begin+"&date_end="+obj.date_end
    return fetch(url).then( response => response.json() );
  },

  //get1，2，3级部门的初始化数据   base/depdict
  getDepartmentData(){
    let url = domain + "base/depdict";
    return fetch(url).then( response => response.json() );
  }

}

//url字符串处理函数
export const dealUrl = (url)=>{
  //获取第一次出现?的下标
  let first = url.indexOf("?");
  let _str = url.substr(first + 1, url.length); //截取问号?之后的内容
  let _arr = _str.split("&"); //用&分割字符串
  // console.log(_arr);

  let newObj = {};
  for (let i = 0; i < _arr.length; i++) {
    //将_arr数组中的字符串元素,用=分割成字符串数组,并选择第2个元素
    let eleKey = _arr[i].split("=")[0];
    let eleValue = _arr[i].split("=")[1];
    newObj[eleKey] = eleValue;
  }
  return newObj;
}