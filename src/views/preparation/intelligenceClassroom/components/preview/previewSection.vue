<template>
    <div class="me-preview">
        <div class="mep-container">
            <PageList
                class="preview-pagelist"
                :pageListOption="pageList"
                :WinActiveId="WinActiveIdProp"
                :WindowName="WindowNameProp"
                :LessonID="LessonIDProp"
                :CardName="CardName"
                :CardId="CardId"
                ref="PageList"
                @changeRemark="changeRemark"
                @lastPage="lastPage"
                @firstPage="firstPage"
                :showRemark="showRemark"
                :winList="winList"
            />
            <transition name="fade">
                <Remark :value="remark" v-if="showRemark" />
            </transition>
        </div>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs, watch } from "vue";
import preventRemark from "../../hooks/previewRemark";
import Remark from "./remark.vue";
import PageList from "./pageList.vue";
export default defineComponent({
    components: {
        Remark,
        PageList
    },
    props: ["options", "winActiveId", "WindowName", "LessonID", "winList"],
    setup(props, { emit }) {
        const { data, showRemark, toggleRemark } = preventRemark();
        const pageList = ref({});
        const WinActiveIdProp = computed(() => props.winActiveId);
        const WindowNameProp = computed(() => props.WindowName);
        const LessonIDProp = computed(() => props.LessonID);
        const remark = ref("");
        const PageList = ref();
        const CardId = ref("");
        const CardName = ref("");
        const changeWinSize = () => {
            emit("changeWinSize"); // 切换窗口大小，清除缓存的笔记列表
        };
        const prevStep = () => {
            PageList.value.prevCard();
        };
        const nextStep = () => {
            PageList.value.nextCard();
        };
        const showWriteBoard = () => {
            PageList.value.showWriteBoard();
        };
        const hideWriteBoard = () => {
            PageList.value.hideWriteBoard();
        };
        const openShape = (event: MouseEvent) => {
            PageList.value.hideWriteBoard();
            PageList.value.openShape(event);
        };
        const changeRemark = (value: string) => {
            remark.value = value;
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
            PageList.value.updateFlags();
        };

        watch(
            () => props.options,
            () => {
                if (!props.options.pages) {
                    remark.value = "";
                    pageList.value = [];
                    CardId.value = "";
                    CardName.value = "";
                } else if (props.options.pages.length > 0) {
                    remark.value = props.options.pages ? props.options.pages[0].Remark : "";
                    pageList.value = props.options.pages ? props.options.pages : [];
                    CardId.value = props.options.id;
                    CardName.value = props.options.name;
                } else {
                    remark.value = "";
                    pageList.value = [];
                    CardId.value = "";
                    CardName.value = "";
                }
            }
        );
        return {
            CardName,
            CardId,
            WinActiveIdProp,
            WindowNameProp,
            LessonIDProp,
            remark,
            PageList,
            ...toRefs(data),
            showRemark,
            pageList,
            toggleRemark,
            prevStep,
            nextStep,
            changeRemark,
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
