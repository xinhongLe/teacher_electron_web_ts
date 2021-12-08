<template>
    <div class="me-preview">
        <div class="mep-container" :style="{ margin: hideTools ? '0' : '0' }">
            <PageList
                class="preview-pagelist"
                style="margin-right: 15px"
                :pageListOption="pageList"
                ref="PageList"
                @changeRemark="changeRemark"
                @lastPage="lastPage"
                @firstPage="firstPage"
            />
            <Remark :value="remark" v-if="showRemark" />
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
    props: ["options", "hideTools"],
    setup(props, { emit }) {
        const { data, showRemark, toggleRemark } = preventRemark();
        const pageList = computed(() => props.options.pages);
        const hideTool = computed(() => props.hideTools);
        const remark = ref("");
        const PageList = ref();
        const prevStep = () => {
            PageList.value.prevCard();
        };
        const nextStep = () => {
            PageList.value.nextCard();
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
            fullScreenStyle.value = true;
            PageList.value.fullScreen();
        };
        const clockFullScreen = () => {
            fullScreenStyle.value = false;
            PageList.value.clockFullScreen();
        };
        watch(
            () => props.options.pages,
            () => {
                remark.value = props.options.pages[0].Remark;
            }
        );
        return {
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
            clockFullScreen
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
