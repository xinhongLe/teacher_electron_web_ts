import remote, { getCurrentWindow, app } from "@electron/remote";
import electron from "electron";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.electron = {
    maximizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else if (currentWindow.isMaximized()) {
            currentWindow.setFullScreen(true);
        } else {
            currentWindow.maximize();
        }
    },
    unmaximizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
            setTimeout(() => {
                currentWindow.unmaximize();
            }, 300);
        } else {
            currentWindow.unmaximize();
        }
    },
    minimizeWindow: () => {
        const currentWindow = getCurrentWindow();
        if (currentWindow.isFullScreen()) {
            currentWindow.setFullScreen(false);
        } else {
            currentWindow.minimize();
        }
    },
    isFullScreen: () => {
        const currentWindow = getCurrentWindow();
        return currentWindow.isFullScreen();
    },
    setFullScreen: () => {
        const currentWindow = remote.getCurrentWindow();
        currentWindow.setFullScreen(true);
    },
    hideWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.hide();
    },
    showWindow: () => {
        const currentWindow = getCurrentWindow();
        currentWindow.show();
    },
    exit: () => {
        app.quit();
    },
    getVersion: () => {
        return remote.app.getVersion();
    },
    isMac: () => {
        return process.platform === "darwin";
    },
    registerEscKeyUp: (callback: () => void) => {
        remote.globalShortcut.register("esc", () => {
            callback && callback();
        });
    },
    unRegisterEscKeyUp: () => {
        remote.globalShortcut.unregister("esc");
    },
    ...electron
};
