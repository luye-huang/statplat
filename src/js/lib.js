/**
 * Created by luye on 31/03/2017.
 */

var Mock = require('mockjs');
export let MockApi = {
  getListMock(){
    return Mock.mock({
      res:'ok',
      'list|1-10': [{      //数据模板
        'id|+1': 1,
        'email': '@EMAIL',
        'regexp3': /\d{5,10}/
      }]
    })
  }
}
export const sqrt = Math.sqrt;
//导出函数
export function square(x) {
  return x * x;
}