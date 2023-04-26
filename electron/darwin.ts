import { join } from "path";
import { release } from "os";
import { execFile as execFileFromAsar } from "child_process";

const DARWIN_IS_PLATFORM_PRE_CATALINA = Number(release().split(".")[0]) < 19; // less than 19.0.0 (macOS 10.15 Catalina)
const PATH_BINARY = join(__dirname, "../ColorPicker");

const execAsync = (command: any, ...args: any[]): Promise<string> => new Promise((resolve) => require("child_process").execFile(
    command,
    args,
    { maxBuffer: 8 * 1024 * 1024 },
    (_: any, stdout: any) => resolve(String(stdout || "")))
);

const parseTitleCol = (titleString: string) => { // a col means \w+\s+, or \s+\w+ (for this output), so every 2 \w\s flip means a col
    let flipCharType = titleString.charAt(0) === " ";
    let flipCount = 2;
    const colEndIndexList = []; // colEndIndex
    for (let index = 0, indexMax = titleString.length; index < indexMax; index++) {
        const charType = titleString.charAt(index) === " ";
        if (flipCharType === charType) continue;
        flipCharType = !flipCharType;
        flipCount--;
        if (flipCount !== 0) continue;
        colEndIndexList.push(index);
        flipCount = 2;
    }
    return colEndIndexList;
};

const getProcessMapAsync = async () => {
    const [titleLine, ...rowList] = (await execAsync("/bin/ps", "x", "-ww", "-o", "pid,ppid,comm")).split("\n");
    const [pidEndIndex, ppidEndIndex] = parseTitleCol(titleLine);
    const processMap: any = {};
    for (const rowString of rowList) {
        if (!rowString) continue;
        const pid = parseInt(rowString.slice(0, pidEndIndex));
        const ppid = parseInt(rowString.slice(pidEndIndex, ppidEndIndex));
        const comm = rowString.slice(ppidEndIndex).trim();
        processMap[pid] = { pid, ppid, comm };
    }
    return processMap;
};

const getDarwinMainBundleIdHackAsync = async () => {
    const processMap = await getProcessMapAsync();
    let mainProcess = processMap[process.pid];
    while (mainProcess && mainProcess.ppid !== 1) mainProcess = processMap[mainProcess.ppid];
    if (!mainProcess) throw new Error("missing mainProcessPid");
    const pathMainAppBinary = mainProcess.comm.trim();
    const pathMainApp = pathMainAppBinary.slice(0, pathMainAppBinary.indexOf("/Contents/MacOS"));
    const mainBundleId = (await execAsync("/usr/bin/defaults", "read", `${pathMainApp}/Contents/Info`, "CFBundleIdentifier")).trim();
    if (!mainProcess) throw new Error("missing mainBundleId");
    return mainBundleId;
};

export const darwinGetScreenPermissionGranted = DARWIN_IS_PLATFORM_PRE_CATALINA
    ? () => Promise.resolve(true)
    : () => new Promise((resolve, reject) => execFileFromAsar(PATH_BINARY, ["--mode=1"], (error, stdout, stderr) => {
        if (error) return reject(error);
        const isDarwinScreenPermissionGranted = stdout.includes("Permission Granted: YES");
        resolve(isDarwinScreenPermissionGranted);
    }));

let mainBundleId: any;
export const darwinRequestScreenPermissionPopup = DARWIN_IS_PLATFORM_PRE_CATALINA
    ? () => Promise.resolve()
    : async () => {
        if (mainBundleId === undefined) mainBundleId = await getDarwinMainBundleIdHackAsync();
        await new Promise((resolve, reject) => execFileFromAsar(PATH_BINARY, ["--mode=2", `--bundle-id=${mainBundleId}`], (error, stdout, stderr) => {
            if (error) return reject(error);
            resolve(stdout); // popup only, no permission result returned, will not wait for user to click anything
        }));
    };
