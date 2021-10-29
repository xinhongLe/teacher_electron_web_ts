import { useStore } from "@/store";
import isElectron from "is-electron";

const exitFullscreen = () => {
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
        // if (currentWindow.isFullScreen()) {
        //     currentWindow.setFullScreen(false);
        // } else {
        //     currentWindow.minimize();
        // }
    } else {
        exitFullscreen();
    }
};
