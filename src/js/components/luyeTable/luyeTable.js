//dependencies: jq, lodash
//lodash modules: map, find, filter, each, get, sortBy, ceil， isEmpty, cloneDeep, values, last, trim
import {data} from './data';
import './luyeTable.less';
const saver = require('file-saver');
const $ = require('jquery');
const _ = require('lodash');

export default class LuyeTable {
  constructor(param) {
    this.initialize(param);
  }

  initialize(param) {
    this.param = {
      el: null,
      data: null,
      url: null,
      columns: null,
      // optional
      dirtyCheck: false,
      export: true,
      pagination: true,
      pageCount: 20,
      globalSearch: true,
      manageColumns: false,
      //initial value lost at first evaluation
      managePageSize: true
    };
    $.extend(this.param, param);
    if (!(this.param.el instanceof $)) {
      this.param.el = $(this.param.el);
    }
    this.initData();
    this.metadata = {
      processingData: _.cloneDeep(this.param.data),
      processingColumns: _.cloneDeep(this.param.columns),
      currentData: null,
      currentPage: 1,
      pageTotal: 0
    };
    if (this.param.dirtyCheck) {
      this.checkDirtyData(this.param.data, this.metadata.processingColumns);
    }
    this.getCurrentData();
    if (!this.metadata.processingData) {
      alert('no data');
      return;
    }
    this.adjustContainer();
    this.render();
  }

  //自执行函数,随LuyeTable在初始化时执行
  // regGlobalClick() {
  //   var store = [];
  //   console.trace();
  //   $('body').on('click', function (evt) {
  //     store = _.filter(store, function (config) {
  //       var elEl = config.element,
  //         handler = config.handler;
  //       if ($.contains(document.body, elEl.get(0))) {
  //         if (handler) {
  //           handler(evt);
  //         } else {
  //           elEl.hide();
  //         }
  //         return true;
  //       } else {
  //         return false;
  //       }
  //     });
  //   });
  //   return function (elSelector, handler) {
  //     console.trace();
  //     store.push({
  //       "element": $(elSelector),
  //       "handler": handler
  //     });
  //   };
  // }()
  initData() {
    if (this.param.url) {

    }
    else if (this.param.data) {

    }
    else {
      this.param.data = data.res;
    }
  }

  getCurrentData() {
    const pageStart = (this.metadata.currentPage - 1) * this.param.pageCount;
    const pageEnd = pageStart + this.param.pageCount;
    this.metadata.currentData = this.metadata.processingData.slice(pageStart, pageEnd);
  }

  //in case that provided data has more attributes than the table needs
  checkDirtyData(data, columns) {
    _.map(data, function (item) {
      let obj = {};
      _.each(columns, function (column) {
        obj[column] = item[column];
      });
      return obj;
    });
  }

  //reset to initial data
  resetData() {
    if (this.param.data) {
      this.metadata.currentPage = 1;
      this.metadata.processingData = _.cloneDeep(this.param.data);
    }
  }

  //create room for a set of controls like export button, cross-table query input
  adjustContainer() {
    this.param.el.css({"position": "relative", "padding-top": "20px"});
  }

  render() {
    // const variables that cannot be reevaluated but can do dom manipulation
    this.wdtb = $('<table id="LuyeTable"></table>');
    this.renderHead();
    this.renderBody();
    this.param.el.html(this.wdtb);
    this.param.pagination && this.renderPages();
    this.param.managePageSize && this.renderLeftBoard();
    this.renderRightBoard();
  }

  renderHead() {
    this.wdtb.find('thead').remove();
    const tpl = String.raw`<thead><tr>
      ${this.metadata.processingColumns.map(column=>`
         <th class="${column.style == "hide" ? "hide" : ""}">${column.cname}<input type="checkbox" class="hide" ${column.style == "hide" ? "value='off'" : "checked='checked'"}/><div><div class="tangle-up arrows"></div><div class="tangle-down arrows"></div></div></th>`)
      }
    </tr></thead>`;
    this.wdtb.append(tpl);
    this.attachSortingEvents();
    this.attachColumnCheckedEvents();
  }

  renderLeftBoard() {
    const tpl = `<div class="left-board"><label>每页数: </label><select>
      ${[10, 20, 30, 50].map(option=>`
        <option value=${option} ${this.param.pageCount == option ? "selected='selected'" : ""}>${option}</option>
      `)}
    </select></div>`
    this.wdtb.before(tpl);
    this.attachPageSizeEvent();
  }

  renderRightBoard() {
    const tpl = `<div class="right-board">
      ${this.param.export ? '<input id="global-search" placeholder="全局关键字查询"/>' : ''}
      <button class="column-management">列管理</button><button class="column-management">重置</button>
      ${this.param.globalSearch ? '<button id = "export-btn">导出</button>' : ''}
    </div>`;
    this.wdtb.before(tpl);
    this.attachGlobalSearchEvent();
    this.attachColumnManagementEvents();
    this.attachExportEvent();
  }

  renderBody(keywords) {
    this.wdtb.find('tbody').remove();
    const $body = $('<tbody></tbody>');
    const columns = this.metadata.processingColumns;
    console.time('start');
    _.each(this.metadata.currentData, function (tr) {
      const $tr = $('<tr></tr>');
      _.each(columns, function (col) {
        const $td = $('<td></td>');
        if (!col.type) {
          let tpl_txt = `${_.get(tr, col.cdata)}`;
          keywords && _.each(keywords, function (keyword) {
            if (tpl_txt.includes(keyword)) {
              let yellowstr = '<span class="yellowed">' + keyword + '</span>';
              tpl_txt = tpl_txt.replace(keyword, yellowstr);
            }
          });
          $td.html(tpl_txt);
        }
        else if (col.type == 'a') {
          let rawUrl = col.url.split('@@');
          let href = "";
          for (let i = 0; i < col.params.length; i++) {
            href += rawUrl[i];
            href += tr[col.params[i]];
          }
          href += _.last(rawUrl);
          const tpl_a = `<a href="${href}">${col.cname}</a>`;
          // $('<a></a>').text(col.cname).attr('href', href);
          $td.append(tpl_a);
        }
        if (col.style == 'fakeA') {
          $td.addClass('fake-a');
        }
        else if (col.style == 'hide') {
          $td.addClass('hide');
        }
        if (col.action) {
          // tr.columnName = col.cname;
          $td.on(col.action, tr, col.trigger).attr('columnName', col.cname);
          // (function (data) {
          //   console.log(data);
          //   $td.on(col.action, data, col.trigger);
          // })(tr);
        }
        $tr.append($td);
      });
      $body.append($tr);
    });
    console.timeEnd('end');
    this.wdtb.append($body);
  }

  renderPages() {
    const {param:params, metadata} = this;
    const $pagination = $('<ul class="pagination"></ul>');
    const pageTotal = metadata.pageTotal = _.ceil(metadata.processingData.length / params.pageCount);
    const pageFirst = metadata.currentPage - 5 < 1 ? 1 : metadata.currentPage - 5;
    const pageLast = pageFirst + 10 > pageTotal ? pageTotal : pageFirst + 10;
    $('ul.pagination').remove();
    for (let i = pageFirst; i <= pageLast; i++) {
      let tpl = `<span>${i}</span>`;
      if (i == metadata.currentPage) {
        tpl = `<span class="current-page">${i}</span>`;
      }
      $pagination.append(tpl);
    }
    if (metadata.currentPage > 1) {
      $pagination.prepend(`<span class="page-prev">&laquo;</span>`);
    }
    if (metadata.currentPage < pageTotal) {
      $pagination.append(`<span class="page-next">&raquo;</span>`);
    }
    this.wdtb.after($pagination);
    this.attachPagingEvents();
    this.renderPageInfo();
  }

  renderPageInfo() {
    const {param:params, metadata} = this;
    const $pageInfo = params.el.find('.page-info');
    if (_.isEmpty($pageInfo)) {
      const tpl = `<div class="page-info">
        <span>当前第</span><input type="text" class="page-info-current" value="${metadata.currentPage}"/>
        <span>页 &nbsp 共</span><span class="page-info-pages">${metadata.pageTotal}</span>
        <span>页 &nbsp 共</span><span class="page-info-items">${metadata.processingData.length}</span><span>条</span>
        <div class="page-info-error hide">请输入有效页码</div>
      </div>`;
      this.wdtb.after(tpl);
      this.attachPagingInfoEvents();
    }
    else {
      $pageInfo.find(".page-info-current").val(metadata.currentPage);
      $pageInfo.find(".page-info-pages").text(metadata.pageTotal);
      $pageInfo.find(".page-info-items").text(metadata.processingData.length);
      $pageInfo.find('.page-info-error').addClass('hide');
    }
  }

  attachPageSizeEvent() {
    const {that = this, param, metadata} = this;
    $('.left-board select').change(function () {
      param.pageCount = $(this).val();
      metadata.pageTotal = _.ceil(metadata.processingData.length / param.pageCount);
      metadata.currentPage = metadata.currentPage > metadata.pageTotal ? metadata.pageTotal : metadata.currentPage;
      that.refresh();
    });
  }

  attachSortingEvents() {
    const {metadata, that = this} = this;
    metadata.app = 1233;
    _.each(this.wdtb.find('thead .arrows'), function (ele) {
      $(ele).click(function () {
        const $this = $(this);
        if ($this.hasClass('invisible')) {
          return;
        }
        const colTxt = $this.parents('th').text();
        const sortParam = _.find(that.param.columns, function (item) {
          return item.cname == colTxt;
        });
        if ($this.hasClass('tangle-up')) {
          metadata.processingData = _.sortBy(metadata.processingData, sortParam.cdata);
        } else {
          metadata.processingData = _.sortBy(metadata.processingData, sortParam.cdata).reverse();
        }
        metadata.currentPage = 1;
        that.refresh();
        $this.toggleClass('invisible');
      })
    });
  }

  attachPagingEvents() {
    const {metadata, that = this} = this;
    _.each($('.pagination>span'), function (ele) {
      $(ele).click(function () {
        const $this = $(this);
        if ($this.hasClass('current-page')) {
          return;
        } else if ($this.hasClass('page-prev')) {
          metadata.currentPage = metadata.currentPage > 1 ? metadata.currentPage - 1 : 1;
        } else if ($this.hasClass('page-next')) {
          metadata.currentPage = metadata.currentPage < metadata.pageTotal ? metadata.currentPage + 1 : metadata.pageTotal;
        } else {
          metadata.currentPage = parseInt($this.text());
        }
        that.refresh();
      });
    });
  }

  attachPagingInfoEvents() {
    const that = this;
    $('.page-info-current').keydown(function () {
      if (event.keyCode == 13) {
        if ($('.page-info-current').val() >= 1 && $('.page-info-current').val() <= that.metadata.pageTotal) {
          that.metadata.currentPage = $('.page-info-current').val();
          that.refresh();
        } else {
          $('.page-info-current').val(that.metadata.currentPage);
          $('.page-info-error').removeClass('hide');
        }
      }
    });
  }

  attachGlobalSearchEvent() {
    const that = this;
    $('.right-board>input').keyup(function () {
      var keyword = $(this).val();
      if (event.keyCode == 13) {
        if (keyword === '') {
          that.resetData();
          that.refresh();
        }
        else {
          that.queryAll(keyword);
        }
      }
      else if (event.keyCode == 8) {
        if (keyword === '') {
          that.resetData();
          that.refresh();
        }
      }
    });
  }

  attachColumnCheckedEvents() {
    this.wdtb.find('thead input').click(function () {
      if ($(this).val() == "on") {
        $(this).removeAttr('checked');
        $(this).val('off');
      }
      else {
        $(this).attr('checked', 'checked');
        $(this).val('on');
      }
    });
  }

  attachColumnManagementEvents() {
    const that = this;
    $('.right-board>button.column-management').click(function () {
      if (this.innerText == "列管理") {
        $('thead input').removeClass('hide');
        $(this).text('确定');
      }
      else if (this.innerText == "重置") {
        $(this).prev().text('列管理');
        that.resetColumns();
      }
      else if (this.innerText == "确定") {
        for (let i = 0; i < that.metadata.processingColumns.length; i++) {
          let val = $($('thead input')[i]).val();
          if (val == 'on') {
            that.metadata.processingColumns[i].style = "";
          }
          else {
            that.metadata.processingColumns[i].style = "hide";
          }
        }
        $(this).text('列管理').next().text('重置');
        that.renderHead();
        that.renderBody();
      }
    });
  }

  // dependencies: bolb FileSaver.js
  // inefficient, consider twice before using this function
  attachExportEvent() {
    const {metadata:{processingColumns:columns, processingData:data}} = this;
    $('#export-btn').click(function () {
      const exportedData = [];
      _.each(data, function (row) {
        let arr = [];
        for (let i = 0; i < columns.length; i++) {
          let str = _.get(row, columns[i].cdata) + "";
          str && str.includes(',') && (str = str.replace(',', '，'));
          arr.push(str);
          if (i == columns.length - 1) {
            exportedData.push(arr + '\n')
          }
        }
      })
      exportedData.unshift(_.map(columns, 'cname') + '\n');
      const blob = new Blob(exportedData, {type: "text/plain;charset=utf-8"});
      saver.saveAs(blob, "download.csv");
    });
  }

  resetSortingArrows() {
    this.wdtb.find('thead .arrows.invisible').toggleClass('invisible');
  }

  resetColumns() {
    this.metadata.processingColumns = _.cloneDeep(this.param.columns);
    this.renderHead();
    this.renderBody();
  }

  query(queryParams) {
    let {metadata, yellowed = []} = this;
    this.resetData();
    queryParams = _.sortBy(queryParams, 'predicate');
    _.each(queryParams, function (queryParam) {
      switch (queryParam.predicate) {
        case "eq":
          metadata.processingData = _.filter(metadata.processingData, function (item) {
            yellowed.push(queryParam.arg1);
            return item[queryParam.queryCol] == queryParam.arg1;
          });
          break;
        case "gt":
          metadata.processingData = _.filter(metadata.processingData, function (item) {
            return item[queryParam.queryCol] >= queryParam.arg1;
          });
          break;
        case "lt":
          metadata.processingData = _.filter(metadata.processingData, function (item) {
            return item[queryParam.queryCol] <= queryParam.arg1;
          });
          break;
        case "rg":
          metadata.processingData = _.filter(metadata.processingData, function (item) {
            return item[queryParam.queryCol] >= queryParam.arg1 && item[queryParam.queryCol] <= queryParam.arg2;
          });
          break;
        case "zkw":
          metadata.processingData = _.filter(metadata.processingData, function (item) {
            yellowed.push(queryParam.arg1);
            return item[queryParam.queryCol].includes(queryParam.arg1);
          });
          break;
      }
    });
    this.refresh(yellowed);
  }

  queryAll(keyword) {
    this.resetData();
    this.metadata.processingData = _.filter(this.metadata.processingData, function (item) {
      return _.values(item).join('Æता').includes(keyword);
    });
    this.refresh([keyword]);
  }

  refresh(keywords) {
    this.getCurrentData();
    this.resetSortingArrows();
    this.renderBody(keywords);
    this.param.pagination && this.renderPages();
  }

  destroy() {
    this.param.el.empty();
  }
}

