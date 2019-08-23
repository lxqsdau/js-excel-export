function underline(str) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase()
}
function styleToJson(style) {
    if (!style) return ''
    var s = []
    for (var i in style) {
        s.push(underline(i) + ':' + style[i]);
    }
    s = s.join(';')
    return s
}


function dataToTable(data) {
    if (Object.prototype.toString.call(data) !== "[object Array]") {
        throw new ReferenceError("数据格式必须是数组类型");
        return;
    }
    var result = "<tbody>";
    data.map(trData => {
        result += "<tr>"
        trData.map(tdData => {
            result += `<td style="${styleToJson(tdData.style)}">${tdData.text}</td>`
        })
        result += "</tr>"
    })
    result += "</tbody>";
    return result;
}

function base64(str) {
    return window.btoa(unescape(encodeURIComponent(str)))
}
function format(s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) { return c[p] })
}

module.exports = function (tableData = [], config = { excelName: "导出excel", worksheet: "sheet" }) {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table style="vnd.ms-excel.numberformat:@;">{table}</table ></body></html>';
    const { excelName, worksheet } = config;
    const ctx = { worksheet, table: dataToTable(tableData) };
    const a = document.createElement("a");
    a.href = uri + base64(format(template, ctx));
    a.download = excelName + '.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}