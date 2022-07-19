import { exec } from "child_process";

export const checkWindowSupportNet = (version: string): Promise<boolean> => {
    return new Promise(resolve => {
        // 校验window是否支持net相对应版本
        const cmdStr = "reg query \"HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\NET Framework Setup\\NDP\"";
        exec(cmdStr, (error, stdout, stderr) => {
            if (error) resolve(false);
            resolve(stdout.indexOf(version) > -1);
        });
    });
}