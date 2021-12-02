<template>
    <div class="ppt-container">
        <PPTEditor
            :slide="slide"
            @onSave="onSave"
            @addCard="addCard"
            @selectVideo="selectVideo"
        />
        <!--选择弹卡-->
        <card-select-dialog
            v-if="dialogVisible"
            v-model:dialogVisible="dialogVisible"
            @selectCard="selectCard"
        ></card-select-dialog>
        <!--选择跟读页视频-->
        <select-video-dialog
            v-if="dialogVisibleVideo"
            v-model:dialogVisible="dialogVisibleVideo"
            @selectVideoVal="selectVideoVal"
        ></select-video-dialog>
    </div>
</template>
<script lang="ts">
import { watch, defineComponent, reactive, toRefs, PropType, ref } from "vue";
import useHome from "@/hooks/useHome";
import { Slide, IWin } from "wincard/src/types/slides";
import CardSelectDialog from "./cardSelectDialog.vue";
import { IPageValue, ICards } from "@/types/home";
import SelectVideoDialog from "./selectVideoDialog.vue";
export default defineComponent({
    name: "winCardEdit",
    components: { SelectVideoDialog, CardSelectDialog },
    props: {
        pageValue: {
            type: Object as PropType<IPageValue>,
            required: true
        }
    },
    setup(props) {
        const state = reactive({
            dialogVisible: false,
            dialogVisibleVideo: false,
            slide: {}
        });
        const page = ref<IPageValue>();
        const { getPageDetail, savePage } = useHome();
        watch(
            () => props.pageValue,
            async (val: IPageValue, oldVal) => {
                if (val && val !== oldVal) {
                    page.value = val;
                    state.slide = await getPageDetail(page.value);
                }
            }
        );
        const onSave = (slide: Slide) => {
            savePage(slide);
        };
        let fun: (win: IWin[]) => void;
        const addCard = (callback: (win: IWin[]) => void) => {
            state.dialogVisible = true;
            fun = callback;
        };
        const selectCard = (cards: ICards[]) => {
            state.dialogVisible = false;
            const newCards = {
                id: page.value!.ID,
                cards: cards
            };
            fun([newCards]);
        };
        const selectVideo = () => {
            state.dialogVisibleVideo = true;
        };
        const selectVideoVal = (val: any) => {
            state.slide = Object.assign({}, state.slide, { follow: val });
            state.dialogVisibleVideo = false;
        };
        return {
            ...toRefs(state),
            onSave,
            addCard,
            selectCard,
            selectVideo,
            selectVideoVal
        };
    }
});
</script>

<style scoped lang="scss">
.ppt-container {
    padding: 0px !important;
    height: 100%;
}
.ppt-editor {
    width: 100%;
}
</style>
