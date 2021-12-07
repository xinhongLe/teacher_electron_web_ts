<template>
    <div class="me-preview">
        <div class="mep-container" :style="{ margin: hideTools ? '0' : '0' }">
            <PageList
                style="margin-right: 15px"
                :pageListOption="pageList"
                ref="PageList"
                @changeRemark="changeRemark"
            />
            <Remark :value="remark" v-if="showRemark" />
        </div>
        <Tools
            class="tools"
            v-if="hideTool"
            :showRemark="showRemark"
            @toggleRemark="toggleRemark"
            @prevStep="prevStep"
            @nextStep="nextStep"
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
    setup(props) {
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
        watch(
            () => props.options.pages,
            () => {
                remark.value = props.options.pages[0].Remark;
            }
        );
        return {
            remark,
            PageList,
            ...toRefs(data),
            showRemark,
            pageList,
            hideTool,
            toggleRemark,
            prevStep,
            nextStep,
            changeRemark
        };
    }
});
</script>

<style lang="scss" scoped>
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
