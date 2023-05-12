import isElectron from "is-electron";

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

// 判断是否全屏
export const isFullscreen = () => {
    if (isElectron()) {
        return window.electron.isFullScreen();
    }
    const dom: any = document;
    return dom.mozFullScreen || dom.webkitIsFullScreen || dom.webkitFullScreen;
};

// 退出全屏
export const exitFullscreen = () => {
    if (isElectron() && isFullscreen()) {
        window.electron.setFullScreen(false);
        return;
    }
    const dom: any = document;
    if (dom.exitFullscreen) dom.exitFullscreen();
    else if (dom.mozCancelFullScreen) dom.mozCancelFullScreen();
    else if (dom.webkitCancelFullScreen) dom.webkitCancelFullScreen();
};
