import {
    SaveDialogReturnValue,
    SaveDialogOptions,
    OpenDialogOptions,
    OpenDialogReturnValue
} from "electron";
import Store from "electron-store";
import {IFileData} from "../../electron/exportWord";
import fs from "fs";
import { CancelTokenSource } from "axios";
import { PlatformPath } from "path";

interface logProps {
    info(...param: any[]): void;

    warn(...param: any[]): void;

    error(...param: any[]): void;

    debug(...param: any[]): void;

    silly(...param: any[]): void;

    verbose(...param: any[]): void;
}

type Electron = {
    exportWord: (filePath: string, fileData: IFileData, styleType: number) => void;
    exit: () => void;
    maximizeWindow: () => void;
    unmaximizeWindow: () => void;
    minimizeWindow: () => void;
    isFullScreen: () => boolean;
    setFullScreen: (flag: boolean) => void;
    getVersion: () => string;
    path: PlatformPath;
    getFileName: (path: string, fileName: string, i: number) => string;
    downloadFile: (url: string, path: string, callback: (progress: number) => void, cancelCallBack: (cancelToken: CancelTokenSource) => void) => Promise<Boolean>;
    isMac: () => boolean;
    registerEscKeyUp: (callback: () => void) => void;
    unRegisterEscKeyUp: () => void;
    hideWindow: () => void;
    setContentSize: (width: number, height: number) => void;
    getCacheFile: (fileName: string) => Promise<string>;
    getFilePath: (fileName: string) => string;
    isExistCacheFile: (fileName: string) => Promise<boolean>;
    isExistFile: (filePath: string) => boolean;
    isExistM3U8: (fileName: string) => Promise<boolean>;
    destroyWindow: () => void;
    showWindow: (isMaximize?: boolean) => void;
    setCenter: () => void;
    getCachePath: (path: string) => string;
    setPath: (name: string, path: string) => Promise<void>;
    getPath: (name: "home" | "appData" | "userData" | "sessionData" | "temp" | "exe" | "module" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "recent" | "logs" | "crashDumps") => string;
    readFile: (path: string, callback: (buffer: ArrayBuffer | string) => void) => void;
    getUpdateUserChoice: () => string;
    saveUpdateUserChoice: (choice: string) => void;
    savePutFile: (path: string, buffer: NodeJS.ArrayBufferView) => void;
    deleteFile: (path: string) => void;
    setPositionWin: (x: number, y: number, ani?: boolean) => void;
    getPositionWin: () => number[];
    getColorHexRGB: () => Promise<unknown>;
    getWhiteBoard: () => Promise<unknown>;
    showSaveDialog: (option: SaveDialogOptions) => Promise<SaveDialogReturnValue>;
    showOpenDialog: (option: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
    checkWindowSupportNet: (version: string) => Promise<boolean>;
    unpackCacheFile: (zipFileName: string, newpath?: string) => Promise<any>;
    packCacheFiles: (cacheFiles: any, path: string) => Promise<string>;
    downloadNewApp: (version: string, callback: (progress: number) => void) => void;
    remote: {
        getCurrentWebContents: () => Electron.WebContents;
        screen: Electron.Screen;
        getCurrentWindow: () => Electron.BrowserWindow;
        app: Electron.App;
        dialog: Electron.Dialog;
    };
    ipcRenderer: Electron.IpcRenderer;
    shell: Electron.Shell;
    store: Store;
    log: logProps;
    convertVideoH264: (filePath: string) => Promise<Buffer>;
    sliceVideoZip: (filePath: string, name: string) => Promise<Buffer>;
    unZip: (path: string) => void;
    getWindowImg: () => Promise<string>;
};

declare global {
    interface Window {
        electron: Electron;
        fabric: any;
        localWincard: boolean;
        MathJax: any
    }
}

export interface LYXSocketInputDTO {
    userID: string;
    userName: string;
    thisImageIndex: number;
    fileList: {
        bucket: string;
        extention: string;
        fileName: string;
        filePath: string;
    }[];
}
