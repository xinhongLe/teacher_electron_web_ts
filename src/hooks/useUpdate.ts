import {ref} from "vue";
import {getOssPaths} from "@/api";
import {set, STORAGE_TYPES} from "@/utils/storage";
import isElectron from "is-electron";
import {ENV} from "@/config";

interface IVersion {
    version: string,
    force: boolean,
    desc: string[],
}

export default () => {
    const updateVisible = ref(false);
    const downloadPercent = ref(0);
    const newVersionView = ref(false);
    const ifShowCancelButton = ref(true);
    const showUpdateInfo = ref<string[]>([]);
    const getUpdateJson = () => {
        const url = "https://app-v.oss-cn-shanghai.aliyuncs.com/teacherElectron/build/update.json?time=" + new Date().getTime();
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                const res = xhr.response;
                const data: IVersion[] = res ? JSON.parse(res) : [];
                const version = window.electron.getVersion();
                if (data[data.length - 1].version > version) {
                    console.log('data---', data)
                    showUpdateData(data);
                }
            }
        };
        xhr.send();
    };
    const showUpdateData = (data: IVersion[]) => {
        const version = window.electron.getVersion();
        const upVersionList = data.filter((item: IVersion) => item.version > version);
        const mustUpdate = upVersionList.find((item: IVersion) => item.force);
        if (mustUpdate) ifShowCancelButton.value = false;
        if (upVersionList.length > 0) showUpdateInfo.value = upVersionList[upVersionList.length - 1]?.desc;
        newVersionView.value = true;
        console.log('newVersionView', newVersionView.value)
    };

    const handleUpdate = () => {
        newVersionView.value = false;
        updateVisible.value = true;
        // window.electron.ipcRenderer.invoke("isUpdateNow");
    };

    getOssPaths().then((res) => {
        if (res.resultCode === 200) {
            set(STORAGE_TYPES.OSS_PATHS, res.result);
        }
    });


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
        ifShowCancelButton,
        showUpdateInfo,
        getUpdateJson,
        handleUpdate
    };
};
