import { BrowserWindow, ipcMain, screen, app, powerMonitor } from "electron";
import { createWindow } from "./createWindow";
import ElectronLog from "electron-log";
import { checkWindowSupportNet } from "./util";
import { spawn, exec, ChildProcessWithoutNullStreams } from "child_process";
import path, { join } from "path";
import detect from "detect-port";
import { Action, CallBack, SocketHelper } from "./socketHelper";

const WIN_PATH_BALL = join(__dirname, "../extraResources/ball/");
let suspensionWin: BrowserWindow | null;
let unfoldSuspensionWin: BrowserWindow | null;
let blackboardWin: BrowserWindow | null;
let timerWin: BrowserWindow | null;
let projectionWin: BrowserWindow | null;
let rollCallWin: BrowserWindow | null;
let teamCompetitionWin: BrowserWindow | null;
let teamCompetitionWin2: BrowserWindow | null;
let answerMachineWin: BrowserWindow | null;
let quickAnswerWin: BrowserWindow | null;
let gameSetWin: BrowserWindow | null;
let isShowTimer = false; // 悬浮球是否显示时间
let isShowVideo = false; // 悬浮球是否显示视频图标
let isShowBlackboard = false; // 悬浮球是否显示黑板图标
let isShowQuestion = false; // 悬浮球是否显示题目图标
let isShowCourse = false; // 悬浮球是否显示课件图标

let socketHelper: SocketHelper;
let socketHelperHeartbeatInterval: any = -1;
let socketHelperHeartbeatCheckInterval: any = -1;
let socketHelperHeartbeatTime = new Date().getTime();
let isShowSuspension = false;
let lastSpwan: ChildProcessWithoutNullStreams | null = null;
let lastPort = 1122;
let isFirstTime = true;
let openTimes = -1;
const lastOpenTime = new Date().getTime();
let currentCourseData: any = null;

const timerURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}timer.html`
        : `file://${__dirname}/timer.html`;
const callURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}rollCall.html`
        : `file://${__dirname}/rollCall.html`;
const suspensionURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}suspension.html`
        : `file://${__dirname}/suspension.html`;
const unfoldSuspensionURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}unfoldSuspension.html`
        : `file://${__dirname}/unfoldSuspension.html`;

const blackboardURL = process.env.NODE_ENV === "development"
    ? `${process.env.WEBPACK_DEV_SERVER_URL}blackboard.html`
    : `file://${__dirname}/blackboard.html`;

const projectionURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}projection.html`
        : `file://${__dirname}/projection.html`;

const answerMachineURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}answerMachine.html`
        : `file://${__dirname}/answerMachine.html`;

const quickAnswerURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}quickAnswer.html`
        : `file://${__dirname}/quickAnswer.html`;

const gameSetURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}gameSet.html`
        : `file://${__dirname}/gameSet.html`;

const localTeamURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}teamCompetition.html`
        : `file://${__dirname}/teamCompetition.html`;

const localTeamURL2 =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}teamCompetition2.html`
        : `file://${__dirname}/teamCompetition2.html`;

const localPreviewURL =
    process.env.NODE_ENV === "development"
        ? `${process.env.WEBPACK_DEV_SERVER_URL}winView.html`
        : `file://${__dirname}/winView.html`;

powerMonitor.on("suspend", () => {
    ElectronLog.log("系统即将休眠");
});

powerMonitor.on("resume", () => {
    ElectronLog.log("解锁后重启小尖尖");
    try {
        if (lastSpwan) {
            lastSpwan.kill();
            lastSpwan.pid && process.kill(lastSpwan.pid);
        }
    } catch (e) {
    }
});

app.on("will-quit", () => {
    try {
        if (lastSpwan) {
            lastSpwan.kill();
            lastSpwan.pid && process.kill(lastSpwan.pid);
        }
    } catch (e) {
    }
});

function setSuspensionSize(isResetPosition = true, isCloseWelt = false) {
    if (!suspensionWin) {
        return;
    }
    let width = 120;
    let height = 120;
    if (isShowTimer || isShowVideo || isShowBlackboard || isShowQuestion || isShowCourse) {
        width = 200;
        height = 200;
    }
    const winPosition = suspensionWin.getPosition();
    const winSize = suspensionWin.getSize();
    suspensionWin.setContentSize(width, height);

    if (isResetPosition) {
        suspensionWin.setPosition(
            winPosition[0] + (winSize[0] - width),
            winPosition[1] + (winSize[1] - height)
        );
    }
    if (isCloseWelt) {
        suspensionWin.setPosition(winPosition[0] - width, winPosition[1]);
    }
}

function checkIsWelt() {
    if (!suspensionWin) {
        return;
    }
    const winPosition = suspensionWin.getPosition();
    const size = screen.getPrimaryDisplay().workAreaSize;
    const winSize = suspensionWin.getSize();
    if (size.width - winPosition[0] - winSize[0] < 10) {
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
    isShowCourse = false;
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
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const width = size.width > 1200 ? 1200 : size.width;
    const height = size.height > 800 ? 800 : size.height;
    rollCallWin = createWindow(callURL, {
        width: width,
        frame: false, // 要创建无边框窗口
        resizable: false, // 是否允许窗口大小缩放
        height: height,
        alwaysOnTop: true,
        useContentSize: true,
        maximizable: false,
    });

    rollCallWin.on("ready-to-show", () => {
        rollCallWin &&
        rollCallWin.webContents.send("sendAllStudentList", allStudentList);
        // rollCallWin && rollCallWin.webContents.openDevTools();
    });

    rollCallWin.on("closed", () => {
        rollCallWin = null;
    });
}

function createUnfoldSuspensionWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const width = size.width > 545 ? 545 : size.width - 80;
    const height = size.height > 680 ? 680 : size.height - 80;
    unfoldSuspensionWin = createWindow(unfoldSuspensionURL, {
        width: width,
        height: height,
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
    const winSize = unfoldSuspensionWin.getSize(); // 获取窗口宽高
    unfoldSuspensionWin.setPosition(
        size.width - winSize[0] - 20,
        size.height - winSize[1]
    );
    // unfoldSuspensionWin.webContents.openDevTools(); //这是打开智课助手悬浮球打开窗口的的调试器
    unfoldSuspensionWin.once("ready-to-show", () => {
        unfoldSuspensionWin &&
        unfoldSuspensionWin.setAlwaysOnTop(true, "pop-up-menu");
    });

    unfoldSuspensionWin.on("closed", () => {
        unfoldSuspensionWin = null;
        ElectronLog.info("unfoldSuspensionWin closed");
    });
}

function createBlackboardWindow() {
    blackboardWin = createWindow(blackboardURL, {
        width: 1000,
        height: 600,
        frame: false, // 要创建无边框窗口
        resizable: true,
        // resizable: false,
        // fullscreen: true,
        minWidth: 1000,
        minHeight: 600,
        show: false,
        useContentSize: true
    });
    // blackboardWin.webContents.openDevTools(); // 打开黑板调试

    blackboardWin.once("ready-to-show", () => {
        blackboardWin && blackboardWin.show();
        blackboardWin && blackboardWin.focus();
        blackboardWin && blackboardWin.setTitle("教学黑板");
    });

    blackboardWin.on("closed", () => {
        blackboardWin = null;
        isShowBlackboard = false;
        suspensionWin &&
        suspensionWin.webContents.send("hideSuspensionBlackboard");
        setSuspensionSize();
    });
}

function createAnswerMachineWindow(allStudentList: []) {
    answerMachineWin = createWindow(answerMachineURL, {
        fullscreen: true,
        center: true,
        show: false,
        useContentSize: true,
        transparent: true,
        // backgroundColor: "#00000000",
        frame: false, // 要创建无边框窗口
        // alwaysOnTop: true,
    });

    answerMachineWin.webContents.openDevTools();

    answerMachineWin.on("ready-to-show", () => {
        answerMachineWin && answerMachineWin.show();
        answerMachineWin && answerMachineWin.focus();
        answerMachineWin &&
        answerMachineWin.webContents.send(
            "sendAllStudentList",
            allStudentList
        );
    });

    answerMachineWin.once("ready-to-show", () => {
        answerMachineWin &&
        answerMachineWin.setAlwaysOnTop(true, "pop-up-menu");
    });

    answerMachineWin.on("closed", () => {
        answerMachineWin = null;
    });
}

function createQuickAnswerWindow(allStudentList: [], isAnswer = false) {
    quickAnswerWin = createWindow(quickAnswerURL, {
        // frame: false, // 要创建无边框窗口
        // alwaysOnTop: true,
        // resizable: false, // 是否允许窗口大小缩放
        // useContentSize: true,
        // maximizable: false,
        fullscreen: true,
        center: true,
        show: false,
        useContentSize: true,
        transparent: true,
        frame: false, // 要创建无边框窗口
    });
    // quickAnswerWin.webContents.openDevTools(); //打开的抢答器调试器

    quickAnswerWin.on("ready-to-show", () => {
        quickAnswerWin && quickAnswerWin.show();
        quickAnswerWin && quickAnswerWin.focus();
        quickAnswerWin &&
        quickAnswerWin.webContents.send(
            "sendAllStudentList",
            allStudentList,
            isAnswer
        );
    });

    quickAnswerWin.once("ready-to-show", () => {
        quickAnswerWin && quickAnswerWin.setAlwaysOnTop(true, "pop-up-menu");
    });

    quickAnswerWin.on("closed", () => {
        quickAnswerWin = null;
    });
}

function createGameSetWindow() {
    gameSetWin = createWindow(gameSetURL, {
        width: 1080,
        height: 920,
        frame: false, // 要创建无边框窗口
        // type: "toolbar",
        alwaysOnTop: true,
        resizable: true, // 是否允许窗口大小缩放
        useContentSize: true,
        maximizable: false
    });
    // gameSetWin.webContents.openDevTools(); // 打开游戏调试器

    gameSetWin.on("ready-to-show", () => {
        gameSetWin && gameSetWin.show();
    });

    gameSetWin.once("ready-to-show", () => {
        gameSetWin && gameSetWin.setAlwaysOnTop(true, "pop-up-menu");
    });

    gameSetWin.on("closed", () => {
        quickAnswerWin = null;
    });
}

function createProjectionWindow() {
    const size = screen.getPrimaryDisplay().workAreaSize;
    projectionWin = createWindow(projectionURL, {
        width: size.width,
        height: size.height,
        type: "toolbar", // 创建的窗口类型为工具栏窗口
        frame: false, // 要创建无边框窗口
        resizable: false,
    });

    projectionWin.once("ready-to-show", () => {
        projectionWin && projectionWin.show();
        projectionWin && projectionWin.focus();
    });

    projectionWin.once("closed", () => {
        projectionWin = null;
    });
}

export function createLocalPreviewWindow(filePath: string) {
    const win = createWindow(localPreviewURL + "?file=" + filePath, {
        show: false,
        frame: false,
        webPreferences: {
            // enableRemoteModule: true,
            webviewTag: true,
            webSecurity: false,
            nodeIntegration: true,
            contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, "preload.js"),
            devTools: !!process.env.WEBPACK_DEV_SERVER_URL,
        },
    });
    win.webContents.openDevTools();
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
            nodeIntegration: false,
        },
    });
    win.once("ready-to-show", () => {
        win.show();
    });

    win.maximize();
}

function checkIsUseBallEXE(callback: (T: boolean, env?: number) => void) {
    if (process.platform === "win32") {
        checkWindowSupportNet("v4.0").then((isOk) => {
            if (isOk) return callback(isOk, 4);
            checkWindowSupportNet("v3.5").then((isOk) => {
                if (isOk) return callback(isOk, 3);
                return callback(false);
            });
        });
    } else {
        callback(false);
    }
}

function createLinuxBall() {
    let ballname = "linux/winball";
    const newEnv = Object.create(process.env);
    newEnv.LD_LIBRARY_PATH = join(WIN_PATH_BALL, "linux/lib");

    return new Promise((resolve) => {
        try {
            if (lastSpwan) {
                lastSpwan.kill();
                lastSpwan.pid && process.kill(lastSpwan.pid);
            }
        } catch (e) {
        }
        try {
            lastSpwan = spawn(
                join(WIN_PATH_BALL, ballname),
                [lastPort.toString()],
                {
                    env: newEnv,
                }
            );
            lastSpwan.stdout.on("data", (data) => {
                console.log(`stdout: ${data}`);
            });

            lastSpwan.stderr.on("data", (data) => {
                console.error(`stderr: ${data}`);
            });

            lastSpwan.on("close", (code) => {
                console.log(`child process exited with code ${code}`);
            });
        } catch (e) {
        }
        setTimeout(() => {
            resolve(true);
        }, 3000);
    });
}

function createBall(forcec = false) {
    if (process.platform === "linux") {
        return createLinuxBall();
    }
    let ballname = "winball/winball.exe";
    let cballname = "ball.exe";
    return new Promise((resolve) => {
        checkIsUseBallEXE((status, env) => {
            if (!status) {
                ballname = cballname;
            } else {
                if (env === 4) {
                    ballname = "winball/4.5/winball.exe";
                }
            }
            try {
                if (lastSpwan) {
                    lastSpwan.kill();
                    lastSpwan.pid && process.kill(lastSpwan.pid);
                }
            } catch (e) {
            }
            try {
                lastSpwan = spawn(
                    join(WIN_PATH_BALL, forcec ? cballname : ballname),
                    [lastPort.toString()]
                );
                lastSpwan.stdout.on("data", (data) => {
                    console.log(`stdout: ${data}`);
                });

                lastSpwan.stderr.on("data", (data) => {
                    console.error(`stderr: ${data}`);
                });

                lastSpwan.on("close", (code) => {
                    console.log(`child process exited with code ${code}`);
                });
            } catch (e) {
            }
            setTimeout(() => {
                resolve(true);
            }, 3000);
        });
    });
}

class CustomCallBack implements CallBack {
    OnDisconnect(): void {
        ElectronLog.log("Error, 需要退出重启");
        if (!isFirstTime) {
            createBall();
        }
    }

    OnConnected(): void {
        isFirstTime = false;
        openTimes = (new Date().getTime() - lastOpenTime) / 1000;
        ElectronLog.log("isShowSuspension", isShowSuspension);
        if (isShowSuspension) {
            showSuspension();
        }
    }

    OnDataReceive(data: Action): void {
        switch (data.METHOD) {
            case "MENUSHOW":
                socketHelper.sendMessage(new Action("SMALLMENUHIDE", ""));
                if (!unfoldSuspensionWin) {
                    createUnfoldSuspensionWindow();
                }
                if (unfoldSuspensionWin) {
                    unfoldSuspensionWin.showInactive();
                }
                const size = screen.getPrimaryDisplay().workAreaSize;
                const winSize = unfoldSuspensionWin!.getSize();

                let newLeft = parseInt(data.DATA.split(",")[0]);
                if (newLeft + winSize[0] > size.width) {
                    newLeft = size.width - winSize[0];
                }

                let newTop = parseInt(data.DATA.split(",")[1]);
                if (newTop + winSize[1] > size.height) {
                    newTop = size.height - winSize[1];
                }

                if (newTop < 100) {
                    newTop = 100;
                }

                unfoldSuspensionWin!.setPosition(newLeft, newTop);
                // 主进程悬浮球点击事件分发
                ipcMain.emit("suspensionClick");
                break;
            case "BLACKBOARDSHOW":
                isShowBlackboard = true;
                socketHelper.sendMessage(new Action("BLACKBOARDSHOW", ""));
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
                socketHelper.sendMessage(new Action("VIDEOSHOW", ""));
                ipcMain.emit("openVideoWin");
                break;
            case "VIDEOHIDE":
                isShowVideo = false;
                ipcMain.emit("closeVideoWin");
                break;
            case "QUESTIONSHOW":
                isShowQuestion = true;
                socketHelper.sendMessage(new Action("QUESTIONSHOW", ""));
                ipcMain.emit("openQuestion");
                break;
            case "QUESTIONHIDE":
                isShowQuestion = false;
                ipcMain.emit("closeQuestion");
                break;
            case "QUICKTIMESHOW":
                isShowTimer = true;
                socketHelper.sendMessage(new Action("QUICKTIMESHOW", ""));
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
            case "PONG":
                socketHelperHeartbeatTime = new Date().getTime();
                break;
            case "COURSEWARE1SHOW":
                isShowCourse = true;
                socketHelper.sendMessage(new Action("COURSEWARE1SHOW", ""));
                ipcMain.emit("setCourseMaximize", currentCourseData);
                break;
            case "COURSEWARE1HIDE":
                ipcMain.emit("closeCourse");
                isShowCourse = false;
                // timerWin && timerWin.destroy();
                break;
        }
    }
}

export function courseShow() {
    if (socketHelper) {
        isShowCourse = true;
        socketHelper.sendMessage(new Action("COURSEWARE1SHOW", ""));
    }
}

export function courseHide() {
    if (socketHelper) {
        isShowCourse = false;
        socketHelper.sendMessage(new Action("COURSEWARE1SHOW", ""));
    }
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
        alwaysOnTop: true, // 窗口是否总是显示在其他窗口之前
    });
    // suspensionWin.webContents.openDevTools();
    const size = screen.getPrimaryDisplay().workAreaSize; // 获取显示器的宽高
    const winSize = suspensionWin.getSize(); // 获取窗口宽高
    suspensionWin.setPosition(
        size.width - winSize[0] - 80,
        size.height - winSize[1] - 350,
        false
    );

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
    if (process.platform === "darwin") {
        createLocalSuspensionWindow();
    } else {
        try {
            if (lastSpwan) {
                lastSpwan.kill();
                lastSpwan.pid && process.kill(lastSpwan.pid);
            }
        } catch (e) {
        }
        detect(lastPort)
            .then((_port) => {
                if (lastPort == _port) {
                    ElectronLog.log(`port: ${lastPort} was not occupied`);
                } else {
                    ElectronLog.log(
                        `port: ${lastPort} was occupied, try port: ${_port}`
                    );
                }
                lastPort = _port;
                ElectronLog.log(`port is ${lastPort}`);
                createBall().then(() => {
                    socketHelper = new SocketHelper(
                        new CustomCallBack(),
                        lastPort
                    );
                    startHeartbeat();
                });
            })
            .catch((err) => {
                ElectronLog.log(err);
            });
    }
    // checkIsUseBallEXE(isOk => {
    //     if (isOk) {

    //     } else {

    //     }
    // });
}

function stopHeartbeat() {
    clearInterval(socketHelperHeartbeatInterval);
    clearInterval(socketHelperHeartbeatCheckInterval);
}

function startHeartbeat() {
    socketHelperHeartbeatTime = new Date().getTime();
    socketHelperHeartbeatInterval = setInterval(() => {
        socketHelper && socketHelper.sendMessage(new Action("PING", ""));
    }, 1000);

    socketHelperHeartbeatCheckInterval = setInterval(() => {
        if ((new Date().getTime() - socketHelperHeartbeatTime) / 1000 > 5) {
            console.log("Heart, 需要退出重启");
            if (openTimes === -1) {
                // 说明程序没起来过
                createBall(true);
            } else {
                // 程序被杀掉或者意外闪退, 尝试重启
                createBall();
            }
        }
    }, 25000);
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
                const x =
                    winStartPosition.x +
                    cursorPosition.x -
                    mouseStartPosition.x;
                const y =
                    winStartPosition.y +
                    cursorPosition.y -
                    mouseStartPosition.y;
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
        isShowSuspension = true;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("SMALLMENUSHOW", ""));
        } else {
            suspensionWin && suspensionWin.showInactive();
        }
    });

    ipcMain.handle("closeSuspension", () => {
        isShowSuspension = false;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("SMALLMENUHIDE", ""));
        } else {
            suspensionWin && suspensionWin.hide();
        }
        unfoldSuspensionWin && unfoldSuspensionWin.hide();
        rollCallWin && rollCallWin.destroy();
        answerMachineWin && answerMachineWin.destroy();
        teamCompetitionWin && teamCompetitionWin.destroy();
        teamCompetitionWin2 && teamCompetitionWin2.destroy();
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
        suspensionWin &&
        suspensionWin.webContents.send("hideSuspensionBlackboard");
        showSuspension();
        setSuspensionSize();
        if (blackboardWin) {
            blackboardWin.show();
            setTimeout(() => {
                if (process.platform === "darwin") {
                    blackboardWin && blackboardWin.setFullScreen(true);
                }
            }, 1000);
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
            suspensionWin &&
            suspensionWin.webContents.send("blackboardMinimized");
        }
        if (process.platform === "darwin") {
            blackboardWin && blackboardWin.setFullScreen(false);
            setTimeout(() => {
                blackboardWin && blackboardWin.hide();
            }, 1000);
        } else {
            blackboardWin && blackboardWin.hide();
        }
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
            socketHelper.sendMessage(new Action("QUICKTIMESHOW", ""));
        }
    });
    ipcMain.handle("closeTimerWin", () => {
        timerWin && timerWin.destroy();
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUICKTIMESHOW", ""));
        }
    });

    ipcMain.handle("openTeamCompetition", () => {
        showSuspension();
        if (teamCompetitionWin) {
            teamCompetitionWin.show();
        } else {
            createTeamCompetition();
        }
    });

    ipcMain.handle("openTeamCompetition2", () => {
        showSuspension();
        if (teamCompetitionWin2) {
            teamCompetitionWin2.show();
        } else {
            createTeamCompetition2();
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

    // 课件最小化
    ipcMain.handle("courseMinimize", (_, data) => {
        data = JSON.parse(data);
        showSuspension();
        isShowCourse = true;
        currentCourseData = data;
        setSuspensionSize();
        if (socketHelper) {
            socketHelper.sendMessage(new Action("COURSEWARE1HIDE", `${path.resolve(data.url)},${data.name}`));
        } else {
            suspensionWin && suspensionWin.webContents.send("courseWinHide", data);
        }
    });

    // 关闭球球工具重置尺寸
    ipcMain.handle("closeBallTool", (_, type: "COURSE_CLOSE") => {
        switch (type) {
            case "COURSE_CLOSE":
                isShowCourse = false;
                break;
        }
        setSuspensionSize();
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
            suspensionWin &&
            suspensionWin.webContents.send("hideSuspensionVideo");
        }
        setSuspensionSize();
    });

    ipcMain.handle("questionMinimized", () => {
        isShowQuestion = true;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUESTIONHIDE", ""));
        } else {
            suspensionWin &&
            suspensionWin.webContents.send("questionMinimized");
        }
        setSuspensionSize();
    });

    ipcMain.handle("hideSuspensionQuestion", () => {
        isShowQuestion = false;
        if (socketHelper) {
            socketHelper.sendMessage(new Action("QUESTIONSHOW", ""));
        } else {
            suspensionWin &&
            suspensionWin.webContents.send("hideSuspensionQuestion");
        }
        setSuspensionSize();
    });

    ipcMain.handle("openProjectionWindow", () => {
        showSuspension();
        setSuspensionSize();
        if (projectionWin) {
            return projectionWin.show();
        }
        createProjectionWindow();
    });

    ipcMain.handle("openAnswerMachineWindow", (_, allStudentList) => {
        showSuspension();
        if (!answerMachineWin) {
            createAnswerMachineWindow(allStudentList);
        } else {
            answerMachineWin && answerMachineWin.show();
        }
    });

    ipcMain.handle("openQuickAnswerWindow", (_, allStudentList, isAnswer) => {
        showSuspension();
        if (!quickAnswerWin) {
            createQuickAnswerWindow(allStudentList, isAnswer);
        }
    });

    ipcMain.handle("openGameSetWindow", (_) => {
        showSuspension();
        if (!quickAnswerWin) {
            createGameSetWindow();
        }
    });

    ipcMain.handle("answer-jection", (_, data) => {
        answerMachineWin &&
        answerMachineWin.webContents.send("answer-jection", data);
    });

    ipcMain.handle("getWindowList", (_, data) => {
        unfoldSuspensionWin &&
        unfoldSuspensionWin.webContents.send("getWindowList", data);
    });
    ipcMain.handle("getCourseWares", (_, data) => {
        unfoldSuspensionWin &&
        unfoldSuspensionWin.webContents.send("getCourseWares", data);
    });
}

export const unfoldSuspensionWinSendMessage = (
    event: string,
    message: string
) => {
    unfoldSuspensionWin && unfoldSuspensionWin.webContents.send(event, message);
};

function createTeamCompetition() {
    teamCompetitionWin = createWindow(localTeamURL, {
        width: 360,
        frame: false, // 要创建无边框窗口
        resizable: false, // 是否允许窗口大小缩放
        height: 250,
        alwaysOnTop: true,
        useContentSize: true,
        maximizable: false,
    });

    teamCompetitionWin.on("ready-to-show", () => {
        // teamCompetitionWin && teamCompetitionWin.webContents.openDevTools();
    });

    teamCompetitionWin.on("closed", () => {
        teamCompetitionWin = null;
    });
}

function createTeamCompetition2() {
    teamCompetitionWin2 = createWindow(localTeamURL2, {
        width: 800,
        frame: false, // 要创建无边框窗口
        resizable: false, // 是否允许窗口大小缩放
        height: 600,
        alwaysOnTop: true,
        useContentSize: true,
        maximizable: false,
    });

    teamCompetitionWin2.on("ready-to-show", () => {
        // teamCompetitionWin && teamCompetitionWin.webContents.openDevTools();
    });

    teamCompetitionWin2.on("closed", () => {
        teamCompetitionWin2 = null;
    });
}
