import electron from "electron";
import { LogFunctions } from "electron-log";

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
    getFilePath: (fileName: string) => string,
    isExistFile: (fileName: string) => Promise<boolean>,
    destroyWindow: () => void,
    showWindow: () => void,
    log: LogFunctions
}

declare global {
    interface Window {
        electron: Electron,
        fabric: any
    }
}

export interface LYXSocketInputDTO {
    userID: string;
    userName: string;
    thisImageIndex: number;
    fileList: {
        bucket: string,
        extention: string,
        fileName: string,
        filePath: string,
    }[];
}
