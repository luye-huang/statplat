/**
 * Created by luye on 19/04/2017.
 */
export const domain = 'http://aeplat.intra.sit.ffan.com/';

export const api = {
  getManageConfig(){
    return fetch(domain+'manager/config').then(response => response.json());
  },

  //提交 项目信息 workflow/work/

  //获取 新建项目信息 -- OK
  getNewProject(id){
    let url = domain+"workflow/work?id="+ id;
    return fetch(url).then( response=> response.json() );
  },

  //获取 准入报告列表信息 -- OK
  getReportList(obj){
    let url = domain+"workflow/list/?date_begin="+obj.date_begin+"&date_end="+obj.date_end;
    return fetch(url).then( response => response.json() );
  },

  /*
    提测报告
     get workflow/report/checkin/?work_id=5
     post workflow/report/checkin/
     get workflow/checkreport/checkin/?work_id=1
     post workflow/checkreport/checkin
   */
  //获取 新建提测报告前,获取提测的jira数据 / 获取 提测报告的信息  -- OK
  getCheckinReport_Jira(work_id){
    let url = domain+"workflow/report/checkin/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交提测报告 workflow/report/checkin

  //获取 查看提测报告的 评估结果  -- OK
  getCheckreportForCheckin(work_id){
    let url = domain+"workflow/checkreport/checkin?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交提测报告审核信息 workflow/checkreport/checkin

  /*
    合板报告
     get workflow/report/merge/?work_id=7
     post workflow/report/merge/
     get workflow/checkreport/merge/?work_id=7
     post workflow/checkreport/merge
   */
  //获取 新建合板报告前,获取合板的jira数据 /  -- OK
  getMergeReport_Jira(work_id){
    let url = domain+"workflow/report/merge/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交合板报告 workflow/report/merge

  //获取 查看合板报告的 评估结果  -- OK
  getCheckreportForMerge(work_id){
    let url = domain+"workflow/checkreport/merge?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交合版报告审核信息 workflow/checkreport/merge

  /*
    上线报告
    get workflow/report/online/?work_id=8
    post workflow/report/online
    get workflow/checkreport/online/?work_id=8
    post workflow/checkreport/online
   */
  //获取 新建上线报告前,获取上线的jira数据 / 获取 上线报告的信息  -- OK
  getOnlineReport_Jira(work_id){
    let url = domain+"workflow/report/online/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交合板报告 workflow/report/online

  //获取 查看上线报告的 评估结果  -- OK
  getCheckreportForOnline(work_id){
    let url = domain+"workflow/checkreport/online/?work_id="+work_id;
    return fetch(url).then( response => response.json() );
  },

  //提交 提交上线报告审核信息 workflow/checkreport/online


}