import html2canvas from 'html2canvas';
import JsPDF from 'jspdf';

/**
 * @param    ele              要生成 pdf 的DOM元素（容器）
 * @param    padfName         PDF文件生成后的文件名字
 * */

function addWaterMarker(str: string, parentDom: any) {
    let mainBox: any = document.getElementById(`download-box`);
    let cover = document.createElement('div');
    parentDom.appendChild(cover);
    cover.style.width = `${mainBox.clientWidth}px`;
    cover.style.height = `${mainBox.clientHeight}px`;
    cover.style.position = "absolute";
    cover.style.zIndex = '9999';
    cover.style.top = '0';
    cover.style.left = '0';

    const widths = 500;
    const heights = 250;
    let cpyName = str;
    if (str.length > 16) {
        cpyName = str.substring(0, 16);
    }
    let can = document.createElement('canvas');
    cover.appendChild(can);
    can.width = widths;
    can.height = heights;
    can.style.display = 'none';
    can.style.zIndex = '9999';
    can.style.overflow = 'hidden';

    let cans: any = can.getContext('2d');
    cans.rotate(-30 * Math.PI / widths);
    cans.font = "200 16px PingFangSC-Regular, PingFang SC";
    cans.fillStyle = "#eee";
    cans.textAlign = 'center';
    cans.textBaseline = 'Middle';
    if (cans.measureText(cpyName).width > widths) {
        let size = widths / cpyName.length
        cans.font = '200 ' + size + 'px ' + ' PingFangSC-Regular, PingFang SC'
    }
    cans.fillText(cpyName, 60, 100);
    cover.style.backgroundImage = "url(" + can.toDataURL("image/png") + ")";
}

export const downloadPDF = (ele: any, pdfName: any, callback: any) => {
    // addWaterMarker(`${pdfName}`, ele);
    // addWaterMarker(`${JSON.parse(sessionStorage.getItem("baseInfo")).Name}-${JSON.parse(sessionStorage.getItem("baseInfo")).Phone}`, ele);
    window.scrollTo(0, 0);
    let eleW = ele.offsetWidth; // 获得该容器的宽
    let eleH = ele.offsetHeight; // 获得该容器的高
    let eleOffsetTop = ele.offsetTop; // 获得该容器到文档顶部的距离
    let eleOffsetLeft = ele.offsetLeft; // 获得该容器到文档最左的距离

    let canvas = document.createElement("canvas");
    let abs = 0;

    let win_in = document.documentElement.clientWidth || document.body.clientWidth; // 获得当前可视窗口的宽度（不包含滚动条）
    let win_out = window.innerWidth; // 获得当前窗口的宽度（包含滚动条）

    if (win_out > win_in) {
        // abs = (win_o - win_i)/2;        // 获得滚动条长度的一半
        abs = (win_out - win_in) / 2; // 获得滚动条宽度的一半
        // console.log(a, '新abs');
    }
    canvas.width = eleW * 2; // 将画布宽&&高放大两倍
    canvas.height = eleH * 2;

    let context: any = canvas.getContext("2d");
    context.scale(2, 2);
    context.translate(-eleOffsetLeft - abs, -eleOffsetTop);
    // 这里默认横向没有滚动条的情况，因为offset.left(),有无滚动条的时候存在差值，因此
    // translate 的时候，要把这个差值去掉

    html2canvas(ele, {
        scale: 1,
        // allowTaint: true,    //允许 canvas 污染， allowTaint参数要去掉，否则是无法通过toDataURL导出canvas数据的
        useCORS: true //允许canvas画布内 可以跨域请求外部链接图片, 允许跨域请求。
    }).then((canvas) => {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        //一页pdf显示html页面生成的canvas高度;
        let pageHeight = contentWidth / 595.28 * 841.89;
        //未生成pdf的html页面高度
        let leftHeight = contentHeight;
        //页面偏移
        let position = 0;
        //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        let imgWidth = 595.28;
        let imgHeight = 595.28 / contentWidth * contentHeight;
        let pageData = canvas.toDataURL('image/jpeg', 1.0);
        let pdf = new JsPDF('p', 'pt', 'a4');
        //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        //当内容未超过pdf一页显示的范围，无需分页
        // console.log('处理完画布高度：' + contentHeight)
        // console.log('每页高度：' + pageHeight)
        // console.log(imgWidth, imgHeight);

        if (leftHeight < pageHeight) {
            //在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
            pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
        } else { // 分页
            while (leftHeight > 10) {
                // console.log(leftHeight)
                pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight);
                leftHeight -= pageHeight;
                position -= 871.89;
                //避免添加空白页
                if (leftHeight > 10) {
                    pdf.addPage();
                }
            }
        }
        //可动态生成
        pdf.save(pdfName,);
        callback();
    })
}
