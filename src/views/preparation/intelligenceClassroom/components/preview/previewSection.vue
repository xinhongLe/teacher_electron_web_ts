<template>
    <div class="me-preview">
        <div class="mep-container">
            <PageList
                class="preview-pagelist"
                ref="pageListRef"
                @lastPage="lastPage"
                @firstPage="firstPage"
            />
            <transition name="fade">
                <Remark :teachProcess="teachProcess" :resourceId="resourceId" :design="design" v-if="showRemark" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, ref, toRefs } from "vue";
import preventRemark from "../../hooks/previewRemark";
import Remark from "./remark.vue";
import PageList from "./pageList.vue";
import { windowInfoKey } from "@/hooks/useWindowInfo";
import { isEmpty } from "lodash";
export default defineComponent({
    props: {
        resourceId: {
            type: String,
            default: ""
        }
    },
    components: {
        Remark,
        PageList
    },
    setup(props, { emit }) {
        const { data, showRemark, toggleRemark } = preventRemark();
        const { currentPageIndex, currentCard } = inject(windowInfoKey)!;
        const teachProcess = computed(() => !isEmpty(currentCard.value?.PageList) && currentCard.value?.PageList[currentPageIndex.value]?.AcademicPresupposition);
        const design = computed(() => !isEmpty(currentCard.value?.PageList) && currentCard.value?.PageList[currentPageIndex.value]?.DesignIntent);
        const pageListRef = ref();
        const changeWinSize = () => {
            emit("changeWinSize"); // 切换窗口大小，清除缓存的笔记列表
        };
        const prevStep = () => {
            pageListRef.value.prevCard();
        };
        const nextStep = () => {
            pageListRef.value.nextCard();
        };
        const showWriteBoard = () => {
            pageListRef.value.showWriteBoard();
        };
        const hideWriteBoard = () => {
            pageListRef.value.hideWriteBoard();
        };
        const openShape = (event: MouseEvent) => {
            pageListRef.value.hideWriteBoard();
            pageListRef.value.openShape(event);
        };
        const lastPage = () => {
            emit("lastPage");
        };
        const firstPage = () => {
            emit("firstPage");
        };
        const fullScreen = () => {
            showRemark.value = false;
            changeWinSize();
        };
        const clockFullScreen = () => {
            showRemark.value = true;
            changeWinSize();
        };
        const updateFlag = () => {
            pageListRef.value.updateFlags();
        };

        return {
            teachProcess,
            design,
            pageListRef,
            ...toRefs(data),
            showRemark,
            toggleRemark,
            prevStep,
            nextStep,
            fullScreen,
            lastPage,
            firstPage,
            clockFullScreen,
            updateFlag,
            showWriteBoard,
            hideWriteBoard,
            openShape,
            changeWinSize
        };
    }
});
</script>

<style lang="scss" scoped>
.remark-fullSrceen{
    position: fixed;
    width: 220px;
    height: calc(100% - 86px);
    top: 0;
    right: 0;
}
.me-preview {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: #f5f6fb;
}
.mep-container {
    min-width: 0;
    flex: 1;
    display: flex;
    min-height: 0;
    margin: 0;
    justify-content: space-between;
    div {
        margin: 0;
        padding: 0;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition-property: width, padding;
    transition-duration: 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    width: 0;
    padding: 0 !important;
}
</style>
