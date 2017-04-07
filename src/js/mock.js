/**
 * Created by luye on 31/03/2017.
 */
var Mock = require('mockjs');
export let domain ={};

export const MockApi = {
  getListMock(){
    console.log(domain);
    return Mock.mock({
      res:'ok',
      'list|1-40': [{      //数据模板
        'id|+1': 1,
        'email': '@EMAIL',
        'regexp3': /\d{5,10}/
      }]
    })
  }
}

// export default MockApi = MockApi; 先实现再赋值的写法要有default