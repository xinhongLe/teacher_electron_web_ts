<template>
    <div class="me-preview">
        <div class="mep-container" :style="{ margin: hideTools ? '0' : '0' }">
            <PageList
                class="preview-pagelist"
                style="margin-right: 15px"
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
            />
            <Remark :class="fullScreenStyle ? 'remark-fullSrceen' : ''" :value="remark" v-if="showRemark" />
        </div>
        <Tools
            :class="fullScreenStyle ? 'tools-fullSrceen' : ''"
            class="tools"
            v-if="hideTool"
            :showRemark="showRemark"
            @toggleRemark="toggleRemark"
            @prevStep="prevStep"
            @nextStep="nextStep"
            @fullScreen="fullScreen"
            @clockFullScreen="clockFullScreen"
            @showWriteBoard="showWriteBoard"
            @hideWriteBoard="hideWriteBoard"
        />
    </div>
</template>

<script>
import { computed, defineComponent, ref, toRefs, watch } from "vue-demi";
import preventRemark from "../../hooks/previewRemark";
import Remark from "./remark.vue";
import Tools from "./tools.vue";
import PageList from "./pageList.vue";
export default defineComponent({
    components: {
        Remark,
        Tools,
        PageList
    },
    props: ["options", "hideTools", "winActiveId", "WindowName", "LessonID"],
    setup(props, { emit }) {
        const { data, showRemark, toggleRemark } = preventRemark();
        const pageList = ref({});
        const hideTool = computed(() => props.hideTools);
        const WinActiveIdProp = computed(() => props.winActiveId);
        const WindowNameProp = computed(() => props.WindowName);
        const LessonIDProp = computed(() => props.LessonID);
        const remark = ref("");
        const PageList = ref();
        const CardId = ref("");
        const CardName = ref("");
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
        const changeRemark = (value) => {
            remark.value = value;
        };
        const lastPage = () => {
            emit("lastPage");
        };
        const firstPage = () => {
            emit("firstPage");
        };
        const fullScreenStyle = ref(false);
        const fullScreen = () => {
            showRemark.value = false;
            fullScreenStyle.value = true;
            PageList.value.fullScreen();
        };
        const clockFullScreen = () => {
            fullScreenStyle.value = false;
            PageList.value.clockFullScreen();
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
            fullScreenStyle,
            ...toRefs(data),
            showRemark,
            pageList,
            hideTool,
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
            hideWriteBoard
        };
    }
});
</script>

<style lang="scss" scoped>
.tools-fullSrceen{
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
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
</style>
