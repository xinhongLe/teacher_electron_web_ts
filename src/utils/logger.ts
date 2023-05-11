import log from "electron-log";
import moment from "moment";

// 关闭控制台打印
log.transports.console.level = false;
log.transports.file.level = "debug";
log.transports.file.maxSize = 5242880;

log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}] [{level}]{scope} {text}";

const date = new Date();
const dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
// 文件位置及命名方式
// 默认位置为：C:\Users\[user]\AppData\Roaming\[appname]\electron_log\
// 文件名为：年-月-日.log
// 自定义文件保存位置为安装目录下 \logs\年-月-日.log
log.transports.file.resolvePath = () => "logs\\" + moment().format("YYYY-MM-DD") + ".log";

export default {
    info(...param: any[]) {
        log.info(param);
    },
    warn(...param: any[]) {
        log.warn(param);
    },
    error(...param: any[]) {
        log.error(param);
    },
    debug(...param: any[]) {
        log.debug(param);
    },
    verbose(...param: any[]) {
        log.verbose(param);
    },
    silly(...param: any[]) {
        log.silly(param);
    }
};
