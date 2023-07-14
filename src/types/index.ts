import electron, {
    SaveDialogReturnValue,
    SaveDialogOptions,
    OpenDialogOptions,
    OpenDialogReturnValue,
    Remote
} from "electron";
import { LogFunctions } from "electron-log";
import Store from "electron-store";
import { IFileData } from "../../electron/exportWord";

interface logProps {
    info(...param: any[]): void;

    warn(...param: any[]): void;

    error(...param: any[]): void;

    debug(...param: any[]): void;

    silly(...param: any[]): void;

    verbose(...param: any[]): void;
}

type Electron = typeof electron & {
    exportWord: (filePath: string, fileData: IFileData, styleType: number) => void;
    exit: () => void;
    maximizeWindow: () => void;
    unmaximizeWindow: () => void;
    minimizeWindow: () => void;
    isFullScreen: () => boolean;
    setFullScreen: (flag: boolean) => void;
    getVersion: () => string;
    isMac: () => boolean;
    registerEscKeyUp: (callback: () => void) => void;
    unRegisterEscKeyUp: () => void;
    hideWindow: () => void;
    setContentSize: (width: number, height: number) => void;
    getCacheFile: (fileName: string) => Promise<string>;
    getFilePath: (fileName: string) => string;
    isExistFile: (fileName: string) => Promise<boolean>;
    isExistM3U8: (fileName: string) => Promise<boolean>;
    destroyWindow: () => void;
    showWindow: (isMaximize?: boolean) => void;
    parsePPT: (pptPath: string) => Promise<any>;
    setCenter: () => void;
    getCachePath: (path: string) => string;
    setPath: (name: string, path: string) => Promise<void>;
    getPath: (name: | "home" | "appData" | "userData" | "cache" | "temp" | "exe" | "module" | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos" | "recent" | "logs" | "crashDumps") => string;
    readFile: (path: string, callback: (buffer: ArrayBuffer | string) => void) => void;
    savePutFile: (path: string, buffer: NodeJS.ArrayBufferView) => void;
    deleteFile: (path: string) => void;
    setPositionWin: (x: number, y: number, ani?: boolean) => void;
    getPositionWin: () => number[];
    getColorHexRGB: () => Promise<unknown>;
    getWhiteBoard: () => Promise<unknown>;
    showSaveDialog: (option: SaveDialogOptions) => Promise<SaveDialogReturnValue>;
    showOpenDialog: (option: OpenDialogOptions) => Promise<OpenDialogReturnValue>;
    getPPTPath: (path: string) => string;
    checkWindowSupportNet: (version: string) => Promise<boolean>;
    unpackCacheFile: (zipFileName: string, newpath?: string) => Promise<any>;
    packCacheFiles: (cacheFiles: any, path: string) => Promise<string>;
    remote: Remote;
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
