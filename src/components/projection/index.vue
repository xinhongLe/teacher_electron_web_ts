<template>
    <div class="container">
        <el-dialog v-model="isShow" fullscreen v-if="isShow">
            <ProjectionContent
                :list="imgList"
                :index="currentIndex"
                v-model:isShow="isShow"
            />
        </el-dialog>
    </div>
</template>

<script lang="ts">
import {LYXSocketInputDTO} from "@/types";
import {getOssUrl} from "@/utils/oss";
import isElectron from "is-electron";
import {defineComponent, onUnmounted, ref} from "vue";
import ProjectionContent from "./ProjectionContent.vue";

export default defineComponent({
    setup() {
        const imgList = ref<string[]>([""]);
        const currentIndex = ref(0);
        const isShow = ref(false);

        const projection = async (_: any, data: LYXSocketInputDTO) => {
            const {thisImageIndex, fileList} = data;
            currentIndex.value = thisImageIndex;
            const imgListPromise = fileList.map((file) => {
                const {extention, fileName, filePath, bucket} = file;
                const key = `${filePath}/${fileName}.${extention}`;
                return getOssUrl(key, bucket);
            });
            imgList.value = await Promise.all(imgListPromise);
            isShow.value = true;
        };

        if (isElectron()) {
            window.electron.ipcRenderer.on(
                "singalRData-Projection",
                projection
            );
        }
        onUnmounted(() => {
            isElectron() &&
            window.electron.ipcRenderer.off(
                "singalRData-Projection",
                projection
            );
        });
        return {
            isShow,
            imgList,
            currentIndex
        };
    },
    components: {ProjectionContent}
});
</script>

<style lang="scss" scoped>
.container {
    :deep(.el-dialog) {
        display: flex;
        flex-direction: column;
        -webkit-app-region: no-drag;

        .el-dialog__body {
            height: 100%;
            display: flex;
            flex-direction: column;
            padding-left: 0;
            padding-right: 0;
            padding-bottom: 0;
            overflow: hidden;
        }
    }

    :deep(.el-overlay) {
        z-index: 20001 !important;
    }
}

</style>
