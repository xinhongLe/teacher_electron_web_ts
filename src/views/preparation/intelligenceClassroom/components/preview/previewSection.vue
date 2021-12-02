<template>
    <div class="me-preview">
        <div class="mep-container" :style="{ margin: hideTools ? '0' : '0' }">
            <PageList
                style="margin-right: 15px"
                :pageListOption="pageList"
                ref="pageList"
            />
            <!-- @nextCard="nextCard"
            @prevCard="prevCard"
            :currentStep.sync="currentStep" -->
            <Remark :value="remark" v-if="showRemark" />
        </div>
        <Tools
            class="tools"
            :showRemark="showRemark"
            @toggleRemark="toggleRemark"
        />
        <!-- v-if="hideTools"
        @prevStep="prevStep"
        @nextStep="nextStep"
        :isLast="isLast"
        :isFirst="isFirst" -->
    </div>
</template>

<script>
import { computed, defineComponent, toRefs, watch } from "vue-demi";
import preventRemark from "../../hooks/previewRemark";
import Remark from "./remark.vue";
import Tools from "./tools.vue";
import PageList from "./pageList.vue";
export default defineComponent({
    components: {
        Remark, Tools, PageList
    },
    props: ["options"],
    setup(props) {
        const { data, showRemark, selectCard, toggleRemark } = preventRemark();
        const pageList = computed(() => props.options.pages);
        selectCard(0);
        return {
            ...toRefs(data),
            showRemark,
            pageList,
            toggleRemark
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
    div{
        margin: 0;
        padding: 0;
    }
}
</style>
