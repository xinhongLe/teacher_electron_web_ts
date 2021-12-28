import { BrowserWindow, ipcMain, screen } from "electron";
import { createWindow } from "./createWindow";
let suspensionWin: BrowserWindow;
let unfoldSuspensionWin: BrowserWindow;
let blackboardWin: BrowserWindow;
let timerWin: BrowserWindow;
let projectionWin: BrowserWindow;
let isShowTimer = false; // 悬浮球是否显示时间
let isShowVideo = false; // 悬浮球是否显示视频图标
let isShowBlackboard = false; // 悬浮球是否显示黑板图标
let isShowQuestion = false; // 悬浮球是否显示题目图标
const timerURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}timer.html`
    : `file://${__dirname}/timer.html`;
const callURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}call.html`
    : `file://${__dirname}/call.html`;
const suspensionURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}suspension.html`
    : `file://${__dirname}/suspension.html`;
const unfoldSuspensionURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}unfoldSuspension.html`
    : `file://${__dirname}/unfoldSuspension.html`;

const blackboardURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}blackboard/index.html`
    : `file://${__dirname}/blackboard/index.html`;

const projectionURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}projection.html`
    : `file://${__dirname}/projection.html`;

function setSuspensionSize(isResetPosition = true, isCloseWelt = false) {
    let width = 120;
    let height = 120;
    if (isShowTimer || isShowVideo || isShowBlackboard || isShowQuestion) {
        width = 200;
        height = 200;
    }
    const winPosition = suspensionWin.getPosition();
    const winSize = suspensionWin.getSize();
    if (isResetPosition) suspensionWin.setPosition(winPosition[0] + (winSize[0] - width), winPosition[1] + (winSize[1] - height));
    if (isCloseWelt) suspensionWin.setPosition(winPosition[0] - width, winPosition[1]);
    suspensionWin.setContentSize(width, height);
}

function checkIsWelt() {
    const winPosition = suspensionWin.getPosition();
    const size = screen.getPrimaryDisplay().workAreaSize;
    const winSize = suspensionWin.getSize();
    if ((size.width - winPosition[0] - winSize[0]) < 10) {
        suspensionWin.webContents.send("showWelt");
        suspensionWin.setPosition(size.width - 20, winPosition[1]);
        suspensionWin.setContentSize(20, 80);
    }
}

function hideSuspensionIcon () {
    isShowTimer = false;
    isShowVideo = false;
    isShowQuestion = false;
    isShowBlackboard = false;
    suspensionWin.webContents.send("timerWinClose");
    suspensionWin.webContents.send("hideSuspensionVideo");
    suspensionWin.webContents.send("hideSuspensionBlackboard");
    suspensionWin.webContents.send("hideSuspensionQuestion");
    setSuspensionSize();
}

function hideTime() {
    isShowTimer = false;
    suspensionWin.webContents.send("timerWinClose");
    setSuspensionSize();
}

function createTimerWindow() {
    timerWin = createWindow(timerURL, {
        width: 800,
        frame: false, // 要创建无边框窗口
        resizable: false, // 禁止窗口大小缩放
        height: 500,
        useContentSize: true
    });
    timerWin.on("ready-to-show", () => {
        timerWin.show();
        timerWin.setTitle("计时器");
    });
    timerWin.on("show", () => {
        hideTime();
    });
    timerWin.on("closed", () => {
        timerWin = null;
        hideTime();
    });
}

function createRollcall() {
    createWindow(callURL, {
        width: 800,
        frame: false, // 要创建无边框窗口
        resizable: false, // 禁止窗口大小缩放
        height: 500,
        useContentSize: true
    });
}
function createUnfoldSuspensionWindow() {
    unfoldSuspensionWin = createWindow(unfoldSuspensionURL, {
        width: 545,
        height: 680,
        type: "toolbar", // 创建的窗口类型为工具栏窗口
        frame: false, // 要创建无边框窗口
        resizable: false, // 禁止窗口大小缩放
        show: false,
        useContentSize: true,
        transparent: true, // 设置透明
        alwaysOnTop: true // 窗口是否总是显示在其他窗口之前
    });
    // 设置黑板窗口位置
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const winSize = unfoldSuspensionWin.getSize(); // 获取窗口宽高
    unfoldSuspensionWin.setPosition(size.width - winSize[0] - 20, size.height - winSize[1]);

    unfoldSuspensionWin.on("closed", () => {
        unfoldSuspensionWin = null;
    });
}

function createBlackboardWindow() {
    blackboardWin = createWindow(blackboardURL, {
        width: 1000,
        height: 750,
        frame: false, // 要创建无边框窗口
        resizable: false,
        fullscreen: true,
        useContentSize: true
    });
    blackboardWin.once("ready-to-show", () => {
        blackboardWin.show();
        blackboardWin.focus();
    });

    blackboardWin.on("closed", () => {
        blackboardWin = null;
        isShowBlackboard = false;
        suspensionWin.webContents.send("hideSuspensionBlackboard");
        setSuspensionSize();
    });
}

function createProjectionWindow() {
    projectionWin = createWindow(projectionURL, {
        width: 1400,
        height: 1000,
        type: "toolbar", // 创建的窗口类型为工具栏窗口
        frame: false, // 要创建无边框窗口
        alwaysOnTop: true,
        resizable: false
    });

    projectionWin.once("ready-to-show", () => {
        projectionWin.show();
    });

    projectionWin.once("closed", () => {
        projectionWin = null;
    });
}

function createSubjectToolWindow(url, name) {
    const win = createWindow(url, {
        alwaysOnTop: true,
        show: false,
        webPreferences: {
            nodeIntegration: false
        }
    });
    win.once("ready-to-show", () => {
        win.show();
        win.setTitle(`爱学仕学科工具《${name}》`);
    });

    win.loadURL(url);
    win.maximize();
}

export function createSuspensionWindow() {
    suspensionWin = createWindow(suspensionURL, {
        width: 120,
        height: 120,
        type: "toolbar", // 创建的窗口类型为工具栏窗口
        frame: false, // 要创建无边框窗口
        resizable: false, // 禁止窗口大小缩放
        show: false,
        useContentSize: true,
        transparent: true, // 设置透明
        alwaysOnTop: true // 窗口是否总是显示在其他窗口之前
    });
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const winSize = suspensionWin.getSize(); // 获取窗口宽高
    suspensionWin.setPosition(size.width - winSize[0] - 80, size.height - winSize[1] - 50, false);

    suspensionWin.once("ready-to-show", () => {
        createUnfoldSuspensionWindow();
    });
    suspensionWin.on("closed", () => {
        suspensionWin = null;
    });
}

function showSuspension() {
    unfoldSuspensionWin.hide();
    suspensionWin.showInactive();
}

export function registerEvent() {
    let winStartPosition = { x: 0, y: 0 };
    let mouseStartPosition = { x: 0, y: 0 };
    let movingInterval = null;
    ipcMain.handle("window-move-open", (events, canMoving) => {
        if (canMoving) {
            // 读取原位置
            const winPosition = suspensionWin.getPosition();
            winStartPosition = { x: winPosition[0], y: winPosition[1] };
            mouseStartPosition = screen.getCursorScreenPoint();
            // 清除
            if (movingInterval) {
                clearInterval(movingInterval);
            }
            // 新开
            movingInterval = setInterval(() => {
                // 实时更新位置
                const cursorPosition = screen.getCursorScreenPoint();
                const x = winStartPosition.x + cursorPosition.x - mouseStartPosition.x;
                const y = winStartPosition.y + cursorPosition.y - mouseStartPosition.y;
                suspensionWin.setPosition(x, y, false);
            }, 20);
        } else {
            clearInterval(movingInterval);
            movingInterval = null;
            setSuspensionSize(false);
            checkIsWelt();
        }
    });

    ipcMain.handle("openSuspension", () => {
        suspensionWin && suspensionWin.showInactive();
    });

    ipcMain.handle("closeSuspension", () => {
        suspensionWin && suspensionWin.hide();
        unfoldSuspensionWin && unfoldSuspensionWin.hide();
        hideSuspensionIcon();
    });

    ipcMain.handle("cancelWelt", () => {
        setSuspensionSize(false, true);
    });

    ipcMain.handle("openUnfoldSuspension", () => {
        suspensionWin.hide();
        if (unfoldSuspensionWin) {
            unfoldSuspensionWin.showInactive();
        } else {
            createUnfoldSuspensionWindow();
        }
    });

    ipcMain.handle("openBlackboard", () => {
        isShowBlackboard = false;
        suspensionWin.webContents.send("hideSuspensionBlackboard");
        showSuspension();
        setSuspensionSize();
        if (blackboardWin) {
            blackboardWin.show();
        } else {
            createBlackboardWindow();
        }
    });

    ipcMain.handle("hideUnfoldSuspensionWin", () => {
        showSuspension();
    });

    ipcMain.handle("openSubjectTool", (_, url, name) => {
        createSubjectToolWindow(url, name);
    });

    ipcMain.on("smallBlackboard", () => {
        isShowBlackboard = true;
        suspensionWin.webContents.send("blackboardMinimized");
        blackboardWin.hide();
        setSuspensionSize();
    });

    ipcMain.handle("closeBlackboard", () => {
        blackboardWin.close();
        setSuspensionSize();
    });

    ipcMain.handle("openTimerWin", () => {
        showSuspension();
        if (timerWin) {
            return timerWin.show();
        }
        createTimerWindow();
    });
    ipcMain.handle("openRollCall", () => {
        showSuspension();
        createRollcall();
    });
    ipcMain.handle("closeTimerWin", () => {
        timerWin.close();
    });

    ipcMain.handle("timerWinHide", (_, time) => {
        showSuspension();
        isShowTimer = true;
        setSuspensionSize();
        suspensionWin.webContents.send("timerWinHide", time);
    });

    ipcMain.handle("timeChange", (_, time) => {
        suspensionWin.webContents.send("timeChange", time);
    });

    ipcMain.handle("videoMinimized", () => {
        isShowVideo = true;
        suspensionWin.webContents.send("videoMinimized");
        setSuspensionSize();
    });

    ipcMain.handle("hideSuspensionVideo", () => {
        isShowVideo = false;
        suspensionWin.webContents.send("hideSuspensionVideo");
        setSuspensionSize();
    });

    ipcMain.handle("questionMinimized", () => {
        isShowQuestion = true;
        suspensionWin.webContents.send("questionMinimized");
        setSuspensionSize();
    });

    ipcMain.handle("hideSuspensionQuestion", () => {
        isShowQuestion = false;
        suspensionWin.webContents.send("hideSuspensionQuestion");
        setSuspensionSize();
    });

    ipcMain.handle("openProjectionWindow", () => {
        if (projectionWin) {
            return projectionWin.show();
        }
        createProjectionWindow();
    });

    ipcMain.handle("loginSuccess", (_, token) => {
        unfoldSuspensionWin && unfoldSuspensionWin.webContents.send("loginSuccess", token);
    });
}
