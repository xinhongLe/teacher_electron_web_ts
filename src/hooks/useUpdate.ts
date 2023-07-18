import {ref} from "vue";
import {getOssPaths} from "@/api";
import {set, STORAGE_TYPES} from "@/utils/storage";
import isElectron from "is-electron";

interface IVersion {
    version: string;
    force: boolean;
    desc: string[];
}

export default () => {
    const updateVisible = ref(false);
    const downloadPercent = ref(0);
    const newVersionView = ref(false);
    const isNewVersion = ref(false);
    const ifShowCancelButton = ref(true);
    const showUpdateInfo = ref<string[]>([]);
    const newVersionNum = ref();
    const getUpdateJson = () => {
        const url = "https://app-v.oss-cn-shanghai.aliyuncs.com/teacherElectron/build/update.json?time=" + new Date().getTime();
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const res = xhr.response;
                const data: IVersion[] = res ? JSON.parse(res) : [];
                const version = window.electron.getVersion();
                newVersionNum.value = data[data.length - 1].version;
                if (newVersionNum.value > version) {
                    showUpdateData(data);
                    isNewVersion.value = false;
                } else {
                    isNewVersion.value = true;
                }
            }
        };
        xhr.send();
    };
    const showUpdateData = (data: IVersion[]) => {
        const version = window.electron.getVersion();
        const upVersionList = data.filter(
            (item: IVersion) => item.version > version
        );
        const mustUpdate = upVersionList.find((item: IVersion) => item.force);
        if (mustUpdate) ifShowCancelButton.value = false;
        if (upVersionList.length > 0)
            showUpdateInfo.value =
                upVersionList[upVersionList.length - 1]?.desc;
        newVersionView.value = true;
        console.log("newVersionView", newVersionView.value);
    };

    // const handleUpdate = () => {
    //     newVersionView.value = false;
    //     updateVisible.value = true;
    // };
    //
    getOssPaths().then((res) => {
        if (res.resultCode === 200) {
            set(STORAGE_TYPES.OSS_PATHS, res.result);
        }
    });

    // 获取更新文件的 URL
    // const downloadUpdate = () => {
    //     const fileName = process.env["VUE_APP_PRODUCT_NAME "] || "爱学仕校园教师端" + "-" + newVersionNum.value + ".exe";
    //     const updataUrl = "https://app-v.oss-cn-shanghai.aliyuncs.com/teacherElectron/build/" + fileName
    //     const UPDATE_TEMP_PATH = path.join(remote.app.getPath("temp"), fileName);
    //     console.log('UPDATE_TEMP_PATH', UPDATE_TEMP_PATH)
    //     // 创建 HTTP 请求
    //     const request = https.get(updataUrl, (response: any) => {
    //         console.log('responseresponseresponse', response);
    //         // 获取更新文件大小
    //         const totalBytes = parseInt(response.headers['content-length'], 10);
    //         console.log('totalBytes', totalBytes)
    //
    //
    //         const fileStream = fs.createWriteStream(UPDATE_TEMP_PATH);
    //         // 下载文件并写入文件流
    //         response.pipe(fileStream);
    //
    //         // 设置下载的字节
    //         let downloadedBytes = 0;
    //
    //         // 更新下载进度条
    //         response.on('data', (chunk: any) => {
    //             downloadedBytes += chunk.length;
    //             downloadPercent.value = Math.round((downloadedBytes / totalBytes) * 100);
    //             ;
    //             console.log('downloadPercent---', downloadPercent.value)
    //         });
    //
    //         // 完成下载并安装更新
    //         response.on('end', () => {
    //             console.log('end----')
    //             // 完成下载后，手动关闭连接
    //             response.destroy();
    //             // installUpdate(filePath);
    //         });
    //     });
    //
    //     // 处理请求错误
    //     request.on('error', (error: any) => {
    //         console.error(error);
    //     });
    // }

    //下载文件
    const downloadUpdate = () => {
        window.electron.downloadNewApp(newVersionNum.value, (progress) => {
            downloadPercent.value = progress;
        });
    };
    if (isElectron()) {
        window.electron.registerEscKeyUp(() => {
            if (!window.electron.isFullScreen()) return;
            window.electron.minimizeWindow();
        });
    }
    return {
        updateVisible,
        downloadPercent,
        newVersionView,
        isNewVersion,
        ifShowCancelButton,
        showUpdateInfo,
        newVersionNum,
        getUpdateJson,
        downloadUpdate,
    };
};
