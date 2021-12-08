import isElectron from "is-electron";

const fullScreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).electron.maximizeWindow();
    } else {
        fullScreen();
    }
};
