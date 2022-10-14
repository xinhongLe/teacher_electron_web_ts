import { ElMessageBox } from "element-plus";
import { Stats, promises } from "fs";
const { readdir, stat, unlink, rmdir } = promises;
import moment from "moment";
import { join } from "path";
import { ref, watch, watchEffect } from "vue";
import { store } from "@/store";
import { getSaveFilePath } from "@/utils";
interface FileInfo extends Stats{
    filePath: string
}

export default async () => {
    const fileInfoList = ref<FileInfo[]>([]);
    const rangeFileList = ref<FileInfo[]>([]);
    const fileTotalSize = ref("");
    const clearCaching = ref(false);
    const deleteFileProgress = ref(0);
    const clearCacheEnd = ref(false);

    const getRangeFileList = (time?: moment.Moment) => {
        if (!time) {
            rangeFileList.value = fileInfoList.value;
        }
        rangeFileList.value = fileInfoList.value.filter(({ birthtime }) =>
            moment(birthtime as Date).isBefore(time)
        );
    };

    const clearCache = () => {
        if (rangeFileList.value.length === 0) {
            return;
        }
        ElMessageBox.confirm("确定清理缓存吗？", "清理缓存", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        }).then(async () => {
            clearCaching.value = true;
            for (const [index, info] of rangeFileList.value.entries()) {
                try {
                    if ((await stat(info.filePath)).isDirectory()) {
                        for (let file of (await readdir(info.filePath))) {
                            await unlink(info.filePath + '/' + file);
                        }
                        await rmdir(info.filePath);
                    }
                    else {
                        await unlink(info.filePath);
                    }
                } catch (error) {
                    window.electron.log.error("clearCache error", error);
                }
                deleteFileProgress.value = (index + 1 / rangeFileList.value.length) * 100;
            }
        });
    };

    watch(deleteFileProgress, (v) => {
        if (v >= 100) {
            clearCaching.value = false;
            clearCacheEnd.value = true;
        }
    });

    watchEffect(() => {
        const id = store.state.userInfo.id;
        if (!id) return;
        promises.readdir(getSaveFilePath(id)).then(async (files) => {
            fileInfoList.value = await Promise.all(
                files.map(async (file) => ({
                    ...(await promises.stat(join(window.electron.getCachePath(""), file))),
                    filePath: join(window.electron.getCachePath(""), file)
                }))
            );
        });
    });

    watchEffect(() => {
        const totalSize = rangeFileList.value.reduce(
            (totalSize, currentValue) => totalSize + currentValue.size,
            0
        );
        fileTotalSize.value = (totalSize / 1024 / 1024).toFixed(2);
    });

    return {
        fileInfoList,
        getRangeFileList,
        clearCache,
        clearCacheEnd,
        deleteFileProgress,
        clearCaching,
        fileTotalSize,
        rangeFileList
    };
};
