import electron from "electron";

type Electron = typeof electron & {
    exit: () => void,
    maximizeWindow: () => void,
    unmaximizeWindow: () => void,
    minimizeWindow: () => void,
    isFullScreen: () => void,
    setFullScreen: () => void,
    getVersion: () => void,
    isMac: () => boolean,
    registerEscKeyUp: (callback: () => void) => void,
    unRegisterEscKeyUp: () => void,
    hideWindow: () => void,
    showWindow: () => void
}

declare global {
    interface Window {
        electron: Electron
    }
}
