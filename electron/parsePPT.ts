import { resolve } from "path";

const PPT2JsonSdk = require("ppt-parse");
const sdk = new PPT2JsonSdk();

export const pptParsePath =
    process.platform === "darwin"
        ? (process.env.HOME || process.env.USERPROFILE) +
        "/.aixueshi_teacher_files/output"
        : resolve(process.env.APPDATA!, "Aixueshi/files/output");

export const parsePPT = async (pptPath: string) => {
    // deleteDir(pptParsePath);
    const result = await sdk.parse(pptPath, pptParsePath);
    return result;
};
