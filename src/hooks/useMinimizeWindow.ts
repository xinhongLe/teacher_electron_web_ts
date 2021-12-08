import isElectron from "is-electron";

const exitFullscreen = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = document;
    if (doc.exitFullscreen) {
        doc.exitFullscreen();
    } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
    } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
    }
};

export default () => {
    if (isElectron()) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).electron.minimizeWindow();
    } else {
        exitFullscreen();
    }
};
