/**
 * Created by luye on 07/04/2017.
 */
import {dataSource} from './data';
const $ = require('jquery');
const _ = require('lodash');
export default class LuyeJsonEditor{
  constructor(param){
    console.log(param);
    this.param = {};
    Object.assign(this.param, param);
    if(!(this.param.dom instanceof $)){
      this.param.dom = $(this.param.dom);
    }
    if(!this.param.data){
      this.param.data = dataSource;
    }
    this.metadata = _.cloneDeep(this.param.data);
    this.render();
    console.log(this.param.dom);
    console.log(this.param.data);
  }
  render(){
    var $container = $('<div class="editor-container"></div>');
    console.log('metadata: '+this.metadata);
    _.forIn(this.metadata, function(value, key){
      console.log('value type is '+ value.constructor);
      console.log(value.constructor==Array);
      console.log(value);
      console.log('key is' + key);
    })
    this.param.dom.html();
  }
}