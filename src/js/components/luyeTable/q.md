https://segmentfault.com/q/1010000008962428
let tpl = `<thead><tr>
  ${this.metadata.processingColumns.map(column=>`
     <th class="${column.style=="hide"?"hide":""}">${column.cname}
     <input type="checkbox" class="hide" ${column.style=="hide"?"value='off'":"checked='checked'"}/>
     <div><div class="tangle-up arrows"></div><div class="tangle-down arrows"></div></div>
     </th>
    `)
  }
</tr></thead>`;


let tpl = `<thead><tr>
  ${_.each(this.metadata.processingColumns,function(column){`
     <th class="${column.style=="hide"?"hide":""}">${column.cname}
     <input type="checkbox" class="hide" ${column.style=="hide"?"value='off'":"checked='checked'"}/>
     <div><div class="tangle-up arrows"></div><div class="tangle-down arrows"></div></div>
     </th>
    `})}
  }
</tr></thead>`;


第一种写法可以 第二种写法就不行，为什么？ 打印出的tpl为
<thead><tr>
  [object Object],[object Object],[object Object],[object Object]
  }
</tr></thead>


在select里 value= ${this.param.pageCount} 这样写 不能选中