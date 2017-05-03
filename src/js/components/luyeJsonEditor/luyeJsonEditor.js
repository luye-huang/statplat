/**
 * Created by luye on 2017/4/12.
 */
import './luyeJsonEditor.less';

const $ = require('jquery');
const cloneDeep = require('lodash.clonedeep');
const loEach = require('lodash.foreach');
// const separator = 'Æता';
const separator = '-';
const relations = new Map();

export default class LuyeJsonEditor {
  constructor(param) {
    this.param = {arrPartialLength: 100};
    Object.assign(this.param, param);
    if (!(this.param.dom instanceof $)) {
      this.param.dom = $(this.param.dom);
    }
    if (!this.param.data) {
      // this.param.data = dataSource;
    }
    this.init();
    this.createDomBuilders();
    this.render();
  }

  init() {
    this.metadata = cloneDeep(this.param.data);
    this.layer = 0;
    this.currentKey = '';
  }

  createDomBuilders() {
    this.rowBuilder = new Proxy({}, {
      get: function (target, property) {
        if (property == 'obj') {
          return function (parentNode, key, value, layer) {
            const txt = `{...}`;
            let id = parentNode.attr('id');
            if (id && id !== 0) {
              id = [id, key].join(separator);
            }
            else {
              id = [parentNode.parent().attr('id'), key].join(separator);
            }
            const node = $(`<div class="editor-row" id="${id}" type="obj" style="margin-left:${layer * 24}px" layer="${layer}">
                <button class="front-btn row-btn-obj">+</button><span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell">${txt}</span>
                <button class="btn-add">ADD</button><button class="btn-del">DEL</button></div>`);
            parentNode.append(node);
            relations.set(id, value);
          }
        }
        else if (property == 'str') {
          return function (parentNode, key, value, layer) {
            const id = [parentNode.attr('id'), key].join(separator);
            const node = $(`<div class="editor-row" id="${id}" type="str" style="margin-left:${layer * 24 + 24}px" layer="${layer}">
                <span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell editor-cell-value">${value}</span>
                <button class="btn-del">DEL</button></div>`);
            parentNode.append(node);
          }
        }
        else if (property == 'arr') {
          return function (parentNode, key, value, layer) {
            const txt = `[0-<span class="arr-len">${value.length}</span>]`;
            let id = parentNode.attr('id');
            if (id && id !== 0) {
              id = [id, key].join(separator);
            }
            else {
              id = [parentNode.parent().attr('id'), key].join(separator);
            }
            const node = $(`<div class="editor-row" id="${id}" type="arr" style="margin-left:${layer * 24}px" layer="${layer}">
                <button class="front-btn row-btn-arr">+</button><span class="editor-cell editor-cell-key">${key}</span><span class="editor-cell">${txt}</span>
                <button class="btn-add">ADD</button><button class="btn-del">DEL</button></div>`);
            parentNode.append(node);
            relations.set(id, value);
          }
        }
      }
    });
  }

  render() {
    this.container = $('<div class="editor-container" layer="0"><button class="btn-add" style="margin-left: 48px">ADD</button></div>');
    this.renderJson();
    this.renderBoard();
    this.param.dom.html(this.container);
    this.attachEventsDelegation();
    this.unfoldAttrs(this.param.layer);
  }

  renderJson(data = this.metadata, node = this.container) {
    const that = this;
    let layer = Number.parseInt(node.attr('layer'));
    layer++;
    loEach(data, function (value, key) {
      if (node.attr('offset') === '0' || node.attr('offset')) {
        key += Number.parseInt(node.attr('offset'));
      }
      if (value.constructor == Object) {
        that.rowBuilder.obj(node, key, value, layer);
      }
      else if (value.constructor == Array) {
        that.rowBuilder.arr(node, key, value, layer);
      }
      else {
        that.rowBuilder.str(node, key, value, layer);
      }
    })
  }

  renderBoard() {
    this.container.append(`<div class="preview-board">${JSON.stringify(this.metadata)}</div><div class="json-dashboard">
        <button class="btn-preview">PREVIEW</button><button class="btn-reset">RESET</button><button class="btn-submit">SUBMIT</button><div id="ctrl1"></div></div>`);
    this.attachSubmitEvent(this.container.find('.btn-submit'));
    this.attachPreviewEvent();
    this.attachResetEvent();
  }

  updateData({data = this.metadata, keys, id, operation, key, value, isKey = false}) {
    const len = keys.length;
    const originalData = cloneDeep(data);
    if (operation == 'modify') {
      if (len < 2) {
        if (isKey) {
          const temp = data[keys[0]];
          data[value] = temp;
        }
        else {
          data[keys[0]] = value;
        }
      }
      else {
        this.updateData({data: data[keys[0]], keys: keys.splice(1), operation, isKey, value});
      }
    }
    else if (operation == 'delete') {
      // map method as an alternative for recursive
      // const idArr = id.split(separator);
      // const attr = idArr.pop();
      // const finalKey = idArr.join(separator);
      // let finalValue;
      // if (finalKey == undefined || finalKey.length == 0){
      //   finalValue = this.metadata;
      // }
      // else{
      //   finalValue = relations.get(finalKey);
      // }
      // delete finalValue[attr];
      // debugger
      // console.log(relations.get(id));
      if (len == 2) {
        const [head,tail] = keys;
        if (data[head].constructor == Array) {
          const endIndex = Number.parseInt(tail);
          delete data[head][endIndex];
          data[head] = this.purifyArray(data[head]);
        }
        else {
          delete data[head][tail];
        }
      }
      else if (len == 1) {
        delete data[keys[0]];
        data.constructor == Array && (data = this.purifyArray(data));
      }
      else {
        this.updateData({data: data[keys[0]], keys: keys.splice(1), operation});
      }
    }
    else if (operation == 'add') {
      const idArr = id.split(separator);
      const attr = idArr.pop();
      const finalKey = idArr.join(separator);
      let finalValue;
      if (finalKey == undefined || finalKey.length == 0) {
        finalValue = this.metadata;
      }
      else {
        finalValue = relations.get(finalKey);
      }
      if (finalValue[attr].constructor == Array) {
        finalValue[attr].push(value);
      }
      else {
        finalValue[attr][key] = value;
      }
    }
    console.log(this.metadata);
    console.log(this.param.data);
    return originalData !== data;
  }

  updateAddedDom(node, key, value, closed) {
    const $btn = node.find('.btn-add');
    $btn.siblings('.adding-dom').toggle();
    node.find('.front-btn').trigger('click');
    node.find('.front-btn').trigger('click');
    // if (closed) {
    //   node.find('.front-btn').trigger('click');
    // }
    // else {
    //   let layer = node.attr('layer');
    //   layer++;
    //   this.rowBuilder.str(node, key, value, layer);
    // }
  }

  updateDeletedDom(node) {
    if (node.parent().attr('type') == 'arr') {
      const index = Number.parseInt(node.find('.editor-cell-key').text());
      let len = node.parent().find('.arr-len').text();
      node.parent().find('.arr-len').text(Number.parseInt(len) - 1);
      len = node.parent().parent().find('.arr-len')[0].innerHTML;
      node.parent().parent().find('.arr-len')[0].innerHTML = Number.parseInt(len) - 1;
      Array.from(node.siblings('.editor-row')).filter((row)=>Number.parseInt($(row).find('.editor-cell-key').text()) > index).map((row)=> {
        const decreasedValue = Number.parseInt($(row).find('.editor-cell-key').text()) - 1;
        let id = $(row).attr('id').split(separator);
        id.pop();
        id.push(decreasedValue);
        $(row).attr('id', id.join(separator));
        $(row).find('.editor-cell-key').text(decreasedValue);
      });
    }
    node.remove();
  }

  purifyArray(array) {
    return array.filter((item)=>item != undefined && item != null);
  }

  attachEventsDelegation() {
    const that = this;
    this.container.delegate('button.row-btn-obj', 'click', function () {
      const parentNode = $(this).parent();
      const txt = $(this).text() == '+' ? '-' : '+';
      $(this).text(txt);
      if (txt == '-') {
        let currentKey = parentNode.attr('id');
        let data = relations.get(currentKey);
        that.renderJson(data, parentNode);
      }
      else {
        $(this).siblings('.editor-row').remove();
      }
    }).delegate('button.row-btn-arr', 'click', function () {
      const parentNode = $(this).parent();
      const txt = $(this).text() == '+' ? '-' : '+';
      $(this).text(txt);
      if (txt == '-') {
        let id = parentNode.attr('id');
        if (!id && (id !== 0)) {
          id = parentNode.attr('_id');
        }
        const value = relations.get(id);
        const len = value.length;
        const layer = Number.parseInt(parentNode.attr('layer')) + 1;
        if (len > that.param.arrPartialLength) {
          for (let i = 0; i < len; i += that.param.arrPartialLength) {
            const idRow = id + i;
            const endIndex = i + that.param.arrPartialLength > len ? len : i + that.param.arrPartialLength;
            const txt = `[${i}-<span class="arr-len">${endIndex}</span>]`;
            console.log(endIndex);
            parentNode.append(`<div class="editor-row" _id="${idRow}" offset="${i}" type="arr" layer="${layer}" style="padding-left:12px"><button class="front-btn row-btn-arr">+</button><span class="editor-cell">${txt}</span></div>`);
            relations.set(idRow, value.slice(i, endIndex));
          }
        }
        else {
          let currentKey = parentNode.attr('id');
          if (!currentKey && (currentKey !== 0)) {
            currentKey = parentNode.attr('_id');
          }
          const data = relations.get(currentKey);
          that.renderJson(data, parentNode);
        }
      }
      else {
        $(this).siblings('.editor-row').remove();
      }
    }).delegate('button.btn-add', 'click', function () {
      $(this).siblings('.adding-dom').remove();
      if ($(this).parent().attr('type') === 'arr') {
        const length = $(this).parent().find('.arr-len')[0].innerHTML;
        $(this).before(`<select class="adding-dom" onchange="this.parentNode.querySelectorAll('input')[1].style.visibility = this.value !== 'str'?'hidden':'visible'"><option selected value="str">String</option><option value="arr">Array</option><option value="obj">Object</option></select>
            <input class="adding-dom" value="${length}" readonly/><input class="adding-dom" autofocus/>
            <button class="btn-adding adding-dom">确定</button><button class="btn-cancel adding-dom">取消</button>`);
      }
      else {
        $(this).before(`<select class="adding-dom" onchange="this.parentNode.querySelectorAll('input')[1].style.visibility = this.value !== 'str'?'hidden':'visible'"><option selected value="str">String</option><option value="arr">Array</option><option value="obj">Object</option></select>
            <input class="adding-dom" autofocus/><input class="adding-dom"/>
            <button class="btn-adding adding-dom">确定</button><button class="btn-cancel adding-dom">取消</button>`);
      }
      $(this).toggle().next().toggle();
    }).delegate('button.btn-cancel', 'click', function () {
      $(this).parent().children('.adding-dom').toggle();
      $(this).siblings('.btn-add').toggle();
      $(this).siblings('.btn-del').toggle();
    }).delegate('button.btn-adding', 'click', function () {
      const $parent = $(this).parent();
      let value = $(this).prev().val();
      if ($(this).siblings('select').val() == 'arr') {
        value = [];
      }
      else if ($(this).siblings('select').val() == 'obj') {
        value = {};
      }
      const key = $(this).prev().prev().val();
      let keys = $parent.attr('id');
      try {
        keys = keys.split(separator).splice(1);
      } catch (err) {
        keys = [];
      }
      if ($.trim(key) == '') {
        return;
      }
      else {
        new Promise((resolve)=> {
          if (that.updateData({id: $parent.attr('id'), operation: 'add', keys, key, value})) {
            $(this).siblings('.btn-add').toggle().siblings('.btn-del').toggle();
            resolve();
          }
        }).then(that.updateAddedDom($parent, key, value, $(this).siblings('.front-btn').text() === '+'));
      }
    }).delegate('button.btn-del', 'click', function () {
      const $parent = $(this).parent();
      new Promise((resolve, reject)=> {
        if (that.updateData({
            id: $parent.attr('id'),
            keys: $parent.attr('id').split(separator).splice(1),
            operation: 'delete'
          })) {
          resolve();
        }
        else {
          alert('deleting fails');
        }
      }).then(that.updateDeletedDom($parent));
    }).delegate('span[class*="editor-cell-"]', 'dblclick', function () {
      let cellValue;
      if (!$(this).has('input').length) {
        cellValue = $(this).text();
        $(this).html(`<input value="${cellValue}" autofocus/><button class="btn-modify">确定</button><button class="btn-modify-cancel">取消</button>`).addClass('transparent');
      }
    }).delegate('.btn-modify', 'click', function () {
      const cellValue = $(this).prev().val();
      const $parent = $(this).parent();
      $parent.html(cellValue).removeClass('transparent');
      // specify param data?
      that.updateData({
        keys: $parent.closest('div').attr('id').split(separator).splice(1),
        operation: 'modify',
        value: cellValue,
        isKey: $parent.hasClass('editor-cell-key')
      });
    }).delegate('.btn-modify-cancel', 'click', function () {
      const cellValue = this.previousSibling.previousSibling.value;
      $(this).parent().html(cellValue).removeClass('transparent');
    })
  }

  attachSubmitEvent(btn) {
    btn.click(()=>console.log(this.metadata))
  }

  attachPreviewEvent() {
    this.container.find('.btn-preview').click(()=>$('.preview-board').text(JSON.stringify(this.metadata)).toggle(500));
  }

  attachResetEvent() {
    this.container.find('.btn-reset').click(()=> {
      this.metadata = cloneDeep(this.param.data);
      this.render();
    });
  }

  unfoldAttrs(layer = 3) {
    for (let i = 1; i <= layer; i++) {
      this.container.find('.editor-row[layer="' + i + '"] button.front-btn').trigger('click');
    }
  }

  destroy() {
    this.param.el.empty();
  }
}
