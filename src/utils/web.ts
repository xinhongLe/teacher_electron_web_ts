/* eslint-disable @typescript-eslint/no-empty-function */
import isElectron from "is-electron";

if (!isElectron()) {
    window.electron = {
        log: {
            error: () => {},
            warn: () => {},
            info: () => {},
            verbose: () => {},
            debug: () => {},
            silly: () => {},
            log: () => {}
        },
        exit: () => {},
        maximizeWindow: () => {},
        unmaximizeWindow: () => {},
        minimizeWindow: () => {},
        isFullScreen: () => {},
        setFullScreen: () => {},
        getVersion: () => {},
        isMac: () => {},
        registerEscKeyUp: () => {},
        unRegisterEscKeyUp: () => {},
        hideWindow: () => {},
        setContentSize: () => {},
        getCacheFile: () => {},
        getFilePath: () => {},
        isExistFile: () => {},
        destroyWindow: () => {},
        showWindow: () => {},
        parsePPT: () => {},
        setCenter: () => {},
        getCachePath: () => {},
        setPath: () => {},
        getPath: () => {},
        readFile: () => {},
        savePutFile: () => {},
        setPositionWin: () => {},
        showSaveDialog: () => {},
        showOpenDialog: () => {},
        ipcRenderer: {
            invoke: () => {},
            on: () => {},
            send: () => {},
            off: () => {},
            removeAllListeners: () => {}
        },
        getPPTPath: () => {}

    } as any;
}