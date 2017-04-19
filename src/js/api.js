/**
 * Created by luye on 19/04/2017.
 */
const domain = 'http://aeplat.intra.sit.ffan.com/';

export const api = {
  getManageConfig(){
    return fetch(domain+'manager/config').then(response => response.json());
  }
}