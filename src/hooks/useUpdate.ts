import { ref } from "vue";

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
        xhr.onload = function() {
            if (xhr.status === 200) {
                showUpdateData(xhr.response);
            }
        };
        xhr.send();
    };

    const showUpdateData = (res: string) => {
        const data: IVersion[] = res ? JSON.parse(res) : [];
        const version = window.electron.getVersion();
        const upVersionList = data.filter((item: IVersion) => item.version > version);
        const mustUpdate = upVersionList.find((item: IVersion) => item.force);
        if (mustUpdate) ifShowCancelButton.value = false;
        if (upVersionList.length > 0) showUpdateInfo.value = upVersionList[upVersionList.length - 1]?.desc;
    };
    return {
        updateVisible,
        downloadPercent,
        newVersionView,
        ifShowCancelButton,
        showUpdateInfo,
        getUpdateJson
    };
};
