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
