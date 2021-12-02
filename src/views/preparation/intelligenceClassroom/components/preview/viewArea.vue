<template>
    <div class="me-view-area" ref="meViewArea">
        <div
            v-if="page.type === 11"
            class="me-work-view"
            :style="{
                width: width + 'px',
                height: height + 'px',
                zoom: newScale,
                backgroundColor: page.pageSetting.backgroundColor,
                backgroundImage: `url(${page.pageSetting.bgImg})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                minWidth: this.width + 'px',
            }"
        >
            <Element
                :step="step"
                :steps="source.steps"
                v-for="(element, index) in source.elements"
                :key="index"
            />
            <!-- @eventAction="eventAction"
            :element="element" -->
        </div>
        <Dictation v-if="page.type === 12" :source="source.elements" />
        <FollowPreview v-if="page.type === 13" :source="source.elements" />
        <!-- <el-dialog
            :visible="showCard"
            :title="card.name"
            :fullscreen="true"
            :modal="false"
        >
            <preview-section-dialog
                v-if="showCard"
                :pageList="card"
            ></preview-section-dialog>
        </el-dialog> -->
    </div>
</template>
<script>
import { defineComponent, ref, watch } from "vue-demi";
import Element from "./element.vue";
import Dictation from "./dictation.vue";
import FollowPreview from "./follow.vue";
export default defineComponent({
    props: ["pageData"],
    components: { Element, Dictation, FollowPreview },
    setup(props) {
        const page = ref({});
        const scale = ref(1);
        const step = ref(-1);
        const source = ref({});
        const showCard = ref(false);
        const card = ref({});
        const initPage = (pageData) => {
            step.value = 1;
            source.value = JSON.parse(JSON.stringify(pageData));
        };
        watch(
            () => props.pageData,
            () => {
                page.value = props.pageData;
                initPage(props.pageData);
            }
        );
        return {
            page,
            scale,
            step,
            source,
            showCard,
            card
        };
    }
});
</script>

<style lang="scss" scoped>
.me-view-area {
    flex: 1;
    min-height: 0;
    min-width: 0;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    /*overflow-y: scroll;*/
}

.me-work-view {
    border: 1px solid #ccc;
    position: relative;
}
</style>
