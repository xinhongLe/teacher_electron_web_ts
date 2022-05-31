import { BrowserWindow, ipcMain, screen, app } from "electron";
import { createWindow } from "./createWindow";
import ElectronLog from "electron-log";
import { checkWindowSupportNet } from "./util";
import { spawn, exec } from "child_process";
import path, { join } from "path";
import { Action, CallBack, SocketHelper } from "./socketHelper";
const PATH_BALL = join(__dirname, "../extraResources/win/ball/ball.exe");
let suspensionWin: BrowserWindow | null;
let unfoldSuspensionWin: BrowserWindow | null;
let blackboardWin: BrowserWindow | null;
let timerWin: BrowserWindow | null;
let projectionWin: BrowserWindow | null;
let rollCallWin: BrowserWindow | null;
let answerMachineWin: BrowserWindow | null;
let isShowTimer = false; // 悬浮球是否显示时间
let isShowVideo = false; // 悬浮球是否显示视频图标
let isShowBlackboard = false; // 悬浮球是否显示黑板图标
let isShowQuestion = false; // 悬浮球是否显示题目图标
let socketHelper: SocketHelper | null = null;
const timerURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}timer.html`
    : `file://${__dirname}/timer.html`;
const callURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}rollCall.html`
    : `file://${__dirname}/rollCall.html`;
const suspensionURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}suspension.html`
    : `file://${__dirname}/suspension.html`;
const unfoldSuspensionURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}unfoldSuspension.html`
    : `file://${__dirname}/unfoldSuspension.html`;

const blackboardURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}blackboard.html`
    : `file://${__dirname}/blackboard.html`;

const projectionURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}projection.html`
    : `file://${__dirname}/projection.html`;

const answerMachineURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}answerMachine.html`
    : `file://${__dirname}/answerMachine.html`;

const localPreviewURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}winView.html`
    : `file://${__dirname}/winView.html`;

function setSuspensionSize(isResetPosition = true, isCloseWelt = false) {
    if (!suspensionWin) {
        return;
    }
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
    if (!suspensionWin) {
        return;
    }
    const winPosition = suspensionWin.getPosition();
    const size = screen.getPrimaryDisplay().workAreaSize;
    const winSize = suspensionWin.getSize();
    if ((size.width - winPosition[0] - winSize[0]) < 10) {
        suspensionWin.webContents.send("showWelt");
        suspensionWin.setPosition(size.width - 20, winPosition[1]);
        suspensionWin.setContentSize(20, 80);
    }
}

function setWelt() {
    if (!suspensionWin) {
        return;
    }
    const winPosition = suspensionWin.getPosition();
    const size = screen.getPrimaryDisplay().workAreaSize;
    suspensionWin.webContents.send("showWelt");
    suspensionWin.setPosition(size.width - 20, winPosition[1]);
    suspensionWin.setContentSize(20, 80);
}

function hideSuspensionIcon() {
    isShowTimer = false;
    isShowVideo = false;
    isShowQuestion = false;
    isShowBlackboard = false;
    if (suspensionWin) {
        suspensionWin.webContents.send("timerWinClose");
        suspensionWin.webContents.send("hideSuspensionVideo");
        suspensionWin.webContents.send("hideSuspensionBlackboard");
        suspensionWin.webContents.send("hideSuspensionQuestion");
    }

    setSuspensionSize();
}

function hideTime() {
    isShowTimer = false;
    suspensionWin && suspensionWin.webContents.send("timerWinClose");
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
        timerWin && timerWin.show();
        timerWin && timerWin.setTitle("计时器");
    });
    timerWin.on("show", () => {
        hideTime();
    });
    timerWin.on("closed", () => {
        timerWin = null;
        hideTime();
    });
}

function createRollcall(allStudentList: []) {
    rollCallWin = createWindow(callURL, {
        width: 800,
        frame: false, // 要创建无边框窗口
        resizable: false, // 禁止窗口大小缩放
        height: 500,
        useContentSize: true
    });

    rollCallWin.on("ready-to-show", () => {
        rollCallWin && rollCallWin.webContents.send("sendAllStudentList", allStudentList);
    });

    rollCallWin.on("closed", () => {
        rollCallWin = null;
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
        backgroundColor: "#00000000",
        alwaysOnTop: true // 窗口是否总是显示在其他窗口之前
    });
    // 设置黑板窗口位置
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const winSize = unfoldSuspensionWin.getSize(); // 获取窗口宽高
    unfoldSuspensionWin.setPosition(size.width - winSize[0] - 20, size.height - winSize[1]);

    unfoldSuspensionWin.once("ready-to-show", () => {
        unfoldSuspensionWin && unfoldSuspensionWin.setAlwaysOnTop(true, "pop-up-menu");
    });

    unfoldSuspensionWin.on("closed", () => {
        unfoldSuspensionWin = null;
        ElectronLog.info("unfoldSuspensionWin closed");
    });
}

function createBlackboardWindow() {
    blackboardWin = createWindow(blackboardURL, {
        width: 1000,
        height: 750,
        frame: false, // 要创建无边框窗口
        resizable: false,
        fullscreen: true,
        show: false,
        useContentSize: true
    });
    blackboardWin.once("ready-to-show", () => {
        blackboardWin && blackboardWin.show();
        blackboardWin && blackboardWin.focus();
        blackboardWin && blackboardWin.setTitle("教学黑板");
    });

    blackboardWin.on("closed", () => {
        blackboardWin = null;
        isShowBlackboard = false;
        suspensionWin && suspensionWin.webContents.send("hideSuspensionBlackboard");
        setSuspensionSize();
    });
}

function createAnswerMachineWindow(allStudentList: []) {
    answerMachineWin = createWindow(answerMachineURL, {
        width: 620,
        height: 422,
        center: true,
        show: false,
        useContentSize: true,
        transparent: true,
        backgroundColor: "#00000000",
        type: "toolbar", // 创建的窗口类型为工具栏窗口
        frame: false, // 要创建无边框窗口
        alwaysOnTop: true,
        resizable: false
    });

    answerMachineWin.on("ready-to-show", () => {
        answerMachineWin && answerMachineWin.show();
        answerMachineWin && answerMachineWin.focus();
        answerMachineWin && answerMachineWin.webContents.send("sendAllStudentList", allStudentList);
    });

    answerMachineWin.on("closed", () => {
        answerMachineWin = null;
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
        projectionWin && projectionWin.show();
    });

    projectionWin.once("closed", () => {
        projectionWin = null;
    });
}

export function createLocalPreviewWindow(filePath: string) {
    const win = createWindow(localPreviewURL + '?file=' + filePath, {
        alwaysOnTop: true,
        show: false,
        frame: false,
        webPreferences: {
            enableRemoteModule: true,
            webviewTag: true,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js"),
            devTools: !!process.env.WEBPACK_DEV_SERVER_URL
        }
    });
    win.once("ready-to-show", () => {
        win.show();
    });

    win.maximize();
}

function createSubjectToolWindow(url: string, name: string) {
    const win = createWindow(url, {
        alwaysOnTop: true,
        show: false,
        title: `爱学仕学科工具《${name}》`,
        webPreferences: {
            nodeIntegration: false
        }
    });
    win.once("ready-to-show", () => {
        win.show();
    });

    win.maximize();
}

function checkIsUseBallEXE(callback: (T: boolean) => void) {
    if (process.platform === "win32") {
        checkWindowSupportNet("v3.5").then(isOk => {
            if (isOk) return callback(isOk);
            checkWindowSupportNet("v4.0").then(isOk => {
                if (isOk) return callback(isOk);
                return callback(false);
            });
        });
    } else {
        callback(false);
    }
}

class CustomCallBack implements CallBack {
    OnDataReceive(data: Action): void {
        switch (data.METHOD) {
            case "MENUSHOW":
                socketHelper && socketHelper.sendMessage(new Action("SMALLMENUHIDE", ""));
                if (!unfoldSuspensionWin) {
                    createUnfoldSuspensionWindow();
                }
                if (unfoldSuspensionWin) {
                    unfoldSuspensionWin.showInactive();
                }
                const size = screen.getPrimaryDisplay().workAreaSize;
                const winSize = unfoldSuspensionWin!.getSize();

                let newLeft = parseInt(data.DATA.split(',')[0]);
                if (newLeft + winSize[0] > size.width) {
                    newLeft = size.width - winSize[0];
                }

                let newTop = parseInt(data.DATA.split(',')[1]);
                if (newTop + winSize[1] > size.height) {
                    newTop = size.height - winSize[1];
                }

                unfoldSuspensionWin!.setPosition(newLeft, newTop);
                break;
            case "BLACKBOARDSHOW":
                isShowBlackboard = true;
                socketHelper && socketHelper.sendMessage(new Action("BLACKBOARDSHOW", ""));
                if (blackboardWin) {
                    blackboardWin.show();
                } else {
                    createBlackboardWindow();
                }
                break;
            case "BLACKBOARDHIDE":
                isShowBlackboard = false;
                blackboardWin && blackboardWin.destroy();
                break;
            case "VIDEOSHOW":
                isShowVideo = true;
                socketHelper && socketHelper.sendMessage(new Action("VIDEOSHOW", ""));
                ipcMain.emit("openVideoWin");
                break;
            case "VIDEOHIDE":
                isShowVideo = false;
                ipcMain.emit("closeVideoWin");
                break;
            case "QUESTIONSHOW":
                isShowQuestion = true;
                socketHelper && socketHelper.sendMessage(new Action("QUESTIONSHOW", ""));
                ipcMain.emit("openQuestion");
                break;
            case "QUESTIONHIDE":
                isShowQuestion = false;
                ipcMain.emit("closeQuestion");
                break;
            case "QUICKTIMESHOW":
                isShowTimer = true;
                socketHelper && socketHelper.sendMessage(new Action("QUICKTIMESHOW", ""));
                if (timerWin) {
                    timerWin.show();
                } else {
                    createTimerWindow();
                }
                break;
            case "QUICKTIMEHIDE":
                isShowTimer = false;
                timerWin && timerWin.destroy();
                break;
        }
    }
}

function isRunning(query: string, cb: (result: boolean) => void) {
    let platform = process.platform;
    let cmd = '';
    switch (platform) {
        case 'win32': cmd = `tasklist`; break;
        case 'darwin': cmd = `ps -ax | grep ${query}`; break;
        case 'linux': cmd = `ps -A`; break;
        default: break;
    }
    exec(cmd, (err, stdout, stderr) => {
        cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
    });
}

function killProcess() {
    return new Promise((resolve, reject) => {
        isRunning("ball.exe", res => {
            if (res) {
                exec(`taskkill /im ball.exe /t /f`, (err, stdout, stderr) => {
                    if (err) {
                        return resolve(true)
                    }
                    console.log('stdout', stdout)
                    console.log('stderr', stderr)
                    resolve(true)
                })
            }
            return resolve(true)
        })
    })
}

function createLocalSuspensionWindow() {
    suspensionWin = createWindow(suspensionURL, {
        width: 120,
        height: 120,
        type: "toolbar", // 创建的窗口类型为工具栏窗口
        frame: false, // 要创建无边框窗口
        resizable: false, // 禁止窗口大小缩放
        show: false,
        useContentSize: true,
        transparent: true, // 设置透明
        backgroundColor: "#00000000",
        alwaysOnTop: true // 窗口是否总是显示在其他窗口之前
    });
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const winSize = suspensionWin.getSize(); // 获取窗口宽高
    suspensionWin.setPosition(size.width - winSize[0] - 80, size.height - winSize[1] - 50, false);

    suspensionWin.once("ready-to-show", () => {
        suspensionWin && suspensionWin.setAlwaysOnTop(true, "pop-up-menu");
        // createUnfoldSuspensionWindow();
    });
    suspensionWin.on("closed", () => {
        suspensionWin = null;
        ElectronLog.info("suspensionWin closed");
    });

    suspensionWin.on("moved", () => {
        setSuspensionSize(false);
        checkIsWelt();
    });

    suspensionWin.on("show", () => {
        setTimeout(() => {
            setWelt();
        }, 3000);
    });
}

export function createSuspensionWindow() {
    checkIsUseBallEXE(isOk => {
        if (isOk) {
            killProcess().then(() => {
                spawn(PATH_BALL);
                console.log("started socket");
                socketHelper = new SocketHelper(new CustomCallBack());
                // createUnfoldSuspensionWindow();

                // 2s后检查是否存在Ball.exe进程, 不存在则使用传统的小尖尖
                setTimeout(() => {
                    isRunning("ball.exe", res => {
                        if (!res) {
                            socketHelper = null;
                            createLocalSuspensionWindow();
                            showSuspension();
                        }
                    });
                }, 2000);
            });
        } else {
            createLocalSuspensionWindow();
        }
    });
}

function showSuspension() {
    unfoldSuspensionWin && unfoldSuspensionWin.hide();
    if (socketHelper) {
        socketHelper.sendMessage(new Action("SMALLMENUSHOW", ""));
    } else {
        suspensionWin && suspensionWin.showInactive();
    }
}

export function registerEvent() {
    let winStartPosition = { x: 0, y: 0 };
    let mouseStartPosition = { x: 0, y: 0 };
    let movingInterval: any = null;
    ipcMain.handle("window-move-open", (events, canMoving) => {
        if (canMoving) {
            if (!suspensionWin) return;
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
                suspensionWin && suspensionWin.setPosition(x, y, false);
            }, 20);
        } else {
            clearInterval(movingInterval);
            movingInterval = null;
            setSuspensionSize(false);
            checkIsWelt();
        }
    });

    ipcMain.handle("openSuspension", () => {
        if (socketHelper) {
            socketHelper.sendMessage(new Action("SMALLMENUSHOW", ""));
        } else {
            suspensionWin && suspensionWin.showInactive();
        }
    });

    ipcMain.handle("closeSuspension", () => {
        if (socketHelper) {
            socketHelper.sendMessage(new Action("SMALLMENUHIDE", ""));
        } else {
            suspensionWin && suspensionWin.hide();
        }
        unfoldSuspensionWin && unfoldSuspensionWin.hide();
        rollCallWin && rollCallWin.destroy();
        answerMachineWin && answerMachineWin.destroy();
        hideSuspensionIcon();
    });

    ipcMain.handle("cancelWelt", () => {
        setSuspensionSize(false, true);
    });

    ipcMain.handle("openUnfoldSuspension", () => {
        if (socketHelper) {
            socketHelper.sendMessage(new Action("SMALLMENUHIDE", ""));
        } else {
            suspensionWin && suspensionWin.hide();
        }
        if (!unfoldSuspensionWin) {
            createUnfoldSuspensionWindow();
        }
        if (unfoldSuspensionWin) {
            unfoldSuspensionWin.showInactive();
        }
    });

    ipcMain.handle("openBlackboard", () => {
        isShowBlackboard = false;
        suspensionWin && suspensionWin.webContents.send("hideSuspensionBlackboard");
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
        if (socketHelper) {
            socketHelper.sendMessage(new Action("BLACKBOARDHIDE", ""));
        } else {
            suspensionWin && suspensionWin.webContents.send("blackboardMinimized");
        }
        blackboardWin && blackboardWin.hide();
        setSuspensionSize();
    });

    ipcMain.handle("closeBlackboard", () => {
        blackboardWin && blackboardWin.destroy();
        setSuspensionSize();
        if (socketHelper) {
            socketHelper.sendMessage(new Action("BLACKBOARDSHOW", ""));
        }
    });

    ipcMain.handle("openTimerWin", () => {
        showSuspension();
        if (timerWin) {
            return timerWin.show();
        }
        createTimerWindow();
    });
    ipcMain.handle("openRollCall", (_, allStudentList) => {
        showSuspension();
        if (rollCallWin) {
            rollCallWin.show();
        } else {
            createRollcall(allStudentList);
        }
    });
    ipcMain.handle("hideTimerWin", () => {
        if (socketHelper) {
            console.log("hideTimerWin");
            socketHelper.sendMessage(new Action("QUICKTIMESHOW", ""));
        }
    });
    ipcMain.handle("closeTimerWin", () => {
        timerWin && timerWin.destroy();
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUICKTIMESHOW", ""));
        }
    });

    ipcMain.handle("timerWinHide", (_, time) => {
        showSuspension();
        isShowTimer = true;
        setSuspensionSize();
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUICKTIMEHIDE", time));
        } else {
            suspensionWin && suspensionWin.webContents.send("timerWinHide", time);
        }
    });

    ipcMain.handle("timeChange", (_, time) => {
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUICKTIMEHIDEINTERVAL", time));
        } else {
            suspensionWin && suspensionWin.webContents.send("timeChange", time);
        }
    });

    ipcMain.handle("videoMinimized", () => {
        isShowVideo = true;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("VIDEOHIDE", ""));
        } else {
            suspensionWin && suspensionWin.webContents.send("videoMinimized");
        }
        setSuspensionSize();
    });

    ipcMain.handle("hideSuspensionVideo", () => {
        isShowVideo = false;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("VIDEOSHOW", ""));
        } else {
            suspensionWin && suspensionWin.webContents.send("hideSuspensionVideo");
        }
        setSuspensionSize();
    });

    ipcMain.handle("questionMinimized", () => {
        isShowQuestion = true;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUESTIONHIDE", ""));
        } else {
            suspensionWin && suspensionWin.webContents.send("questionMinimized");
        }
        setSuspensionSize();
    });

    ipcMain.handle("hideSuspensionQuestion", () => {
        isShowQuestion = false;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUESTIONSHOW", ""));
        } else {
            suspensionWin && suspensionWin.webContents.send("hideSuspensionQuestion");
        }
        setSuspensionSize();
    });

    ipcMain.handle("openProjectionWindow", () => {
        if (projectionWin) {
            return projectionWin.show();
        }
        createProjectionWindow();
    });

    ipcMain.handle("openAnswerMachineWindow", (_, allStudentList) => {
        showSuspension();
        if (!answerMachineWin) {
            createAnswerMachineWindow(allStudentList);
        }
    });

    ipcMain.handle("answer-jection", (_, data) => {
        answerMachineWin && answerMachineWin.webContents.send("answer-jection", data);
    });
}
