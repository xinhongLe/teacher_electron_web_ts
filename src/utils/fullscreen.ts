import isElectron from "is-electron";

// 进入全屏
export const enterFullscreen = () => {
    const docElm: any = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullscreen) {
        docElm.webkitRequestFullScreen();
    }
};

// 判断是否全屏
export const isFullscreen = () => {
    const dom: any = document;
    return dom.mozFullScreen || dom.webkitIsFullScreen || dom.webkitFullScreen;
};

// 退出全屏
export const exitFullscreen = () => {
    if (isElectron()) {
        return (window as any).electron.minimizeWindow();
    }
    const dom: any = document;
    if (dom.exitFullscreen) dom.exitFullscreen();
    else if (dom.mozCancelFullScreen) dom.mozCancelFullScreen();
    else if (dom.webkitCancelFullScreen) dom.webkitCancelFullScreen();
};
