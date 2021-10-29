import isElectron from "is-electron";

const fullScreen = () => {
    const element: any = document.documentElement;
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
};

export default () => {
    if (isElectron()) {
        // const currentWindow = remote.getCurrentWindow();
        // if (currentWindow.isFullScreen()) {
        //     currentWindow.setFullScreen(false);
        // } else if (currentWindow.isMaximized()) {
        //     currentWindow.setFullScreen(true);
        // } else {
        //     currentWindow.maximize();
        // }
    } else {
        fullScreen();
    }
};
