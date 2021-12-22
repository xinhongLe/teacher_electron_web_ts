import electron from "electron";

type Electron = typeof electron & {
    exit: () => void,
    maximizeWindow: () => void,
    unmaximizeWindow: () => void,
    minimizeWindow: () => void,
    isFullScreen: () => void,
    setFullScreen: () => void,
    getVersion: () => string,
    isMac: () => boolean,
    registerEscKeyUp: (callback: () => void) => void,
    unRegisterEscKeyUp: () => void,
    hideWindow: () => void,
    setContentSize: (width: number, height: number) => void,
    getCacheFile: (fileName: string) => Promise<string>,
    destroyWindow: () => void,
    showWindow: () => void
}

declare global {
    interface Window {
        electron: Electron
    }
}
