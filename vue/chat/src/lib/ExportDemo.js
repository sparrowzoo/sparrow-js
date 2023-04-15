import {Sparrow}  from '../../../../source/scripts/sparrow_es.js'

const ExportDemo = {
    name: 'SparrowAjax',
    change: function () {
        console.log(Sparrow.url.name);
        // alert($.url.name);
        alert(this.name);
    }
}

export {ExportDemo,Sparrow}
