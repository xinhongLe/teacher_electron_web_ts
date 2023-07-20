<template>
    <div class="win-card-fixed" v-show="!isMinimized">
        <intelligence-classroom :resource="resource" @setMinimize="setMinimize"/>
    </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {MutationTypes, useStore} from "@/store";
import IntelligenceClassroom from "@/views/preparation/intelligenceClassroom/index.vue";
import {get, set, STORAGE_TYPES, storeChange} from "@/utils/storage";
import {ipcRenderer} from "electron";
import isElectron from "is-electron";
import {getOssUrl} from "@/utils/oss";
import html2canvas from 'html2canvas';
import useUploadFile from "@/hooks/useUploadFile";

const isMinimized = ref(false);
const store = useStore();

const props = defineProps({
    index: {
        type: Number,
        default: 0
    }
});
const couresData: any = ref(null);
const setMinimize = (data: any, url: string) => {
    console.log('url---', url)

    isMinimized.value = true
    console.log(data);
    const params = {
        id: data.WindowID,
        name: data.Name,
        isMinimized: true,
        url: url
    };
    couresData.value = params;
    nextTick(() => {
        if (isElectron()) {
            window.electron.ipcRenderer.invoke("courseMinimize", JSON.stringify(params));
        }
        // const courseImg = captureElement(element);

    })

};

// const captureElement = async (element: HTMLElement) => {
//     // const element = document.querySelector('.intelligence') as HTMLElement;
//     const canvas = await html2canvas(element)
//     // 将Canvas导出为图片
//     const dataURL = canvas.toDataURL('image/png');
//     console.log('dataURL', dataURL)
//     const fileInfo: any = await uploadFile({file: new File([Buffer.from(dataURL, "base64")], `${couresData.value.name}.png`)});
//     const url = await getOssUrl(fileInfo.objectKey, fileInfo.bucket);
//     console.log('fileInfo', fileInfo, url)
//     return url
//
// }
const resource = computed(() => store.state.common.showResourceFullScreen[props.index]?.resource);
onMounted(() => {
    ipcRenderer.on('setCourseMaximize', (e, data) => {
        if (!couresData.value) return
        if (data && couresData.value) {
            isMinimized.value = false;
        }
        if (!data && couresData.value) {
            window.electron.ipcRenderer.invoke("courseMinimize", couresData.value);
        }
    })
    ipcRenderer.on('closeCourse', (e, data) => {
        store.commit(MutationTypes.REMOVE_FULLSCREEN_RESOURCE, {
            id: couresData.value.id,
            openMore: true
        });
        isMinimized.value = true
    })

});

</script>

<style lang="scss" scoped>
/* 最小化时的样式 */
div[v-show="isMinimized"] {
    display: none;
}

.win-card-fixed {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 10000;
    display: flex;
    flex-direction: column;
}
</style>
