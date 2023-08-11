// 导出页面为PDF格式
import html2canvas from "html2canvas";
import JSPDF from "jspdf";

// 进入全屏
export const enterFullscreen = () => {
    if (isElectron()) {
        window.electron.setFullScreen(true);
        return;
    }
    const docElm: any = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullScreen();
    }
};
