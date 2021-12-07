<template>
    <div class="view-box">
        <ScreenView ref="screenRef" :slide="slideView"  @openCard="openCard"  @pagePrev="pagePrev()" @pageNext="pageNext()"/>
       <!-- 弹卡-->
        <open-card-view-dialog v-if="dialogVisible" :cardList="cardList" v-model:dialogVisible="dialogVisible"></open-card-view-dialog>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
import { getCardDetail } from "@/api/home";
import useHome from "@/hooks/useHome";
import { ElMessage } from "element-plus";
import OpenCardViewDialog from "./openCardViewDialog.vue";
export default defineComponent({
    name: "winCardViewDialog",
    components: { OpenCardViewDialog },
    props: {
        pageList: {
            type: Object
        }
    },
    setup(props) {
        const slideView = ref({});
        const pageList = ref([]);
        const index = ref(0);
        const { getPageDetail } = useHome();
        onMounted(async() => {
            pageList.value = props.pageList;
            slideView.value = await getPageDetail(pageList.value[index.value]);
        });

        const pagePrev = async () => {
            if (index.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            index.value--;
            slideView.value = await getPageDetail(pageList.value[index.value]);
        };

        const pageNext = async () => {
            if (index.value === pageList.value.length - 1) {
                return ElMessage({ type: "warning", message: "已经是最后页" });
            }
            index.value++;
            slideView.value = await getPageDetail(pageList.value[index.value]);
        };

        const dialogVisible = ref(false);
        const cardList = ref([]);
        const openCard = async (wins) => {
            if (wins[0] && wins[0].cards) {
                const cards = wins[0].cards;
                let pages = [];
                const newPages = [];
                cards.map(card => {
                    pages = pages.concat(card.slides.map(page => {
                        return {
                            ID: page.id,
                            Type: page.type,
                            Name: page.name
                        };
                    }));
                });
                if (pages.length > 0) {
                    const pageIDs = pages.map(page => page.ID);
                    const res = await getCardDetail({ pageIDs });
                    if (res.resultCode === 200 && res.result && res.result.length > 0) {
                        // 页名称可能会修改
                        res.result.map(item => {
                            pages.map(page => {
                                if (page.ID === item.ID) {
                                    newPages.push(
                                        { Type: page.Type, ID: page.ID, Name: item.Name }
                                    );
                                }
                            });
                        });
                        cardList.value = newPages;
                        dialogVisible.value = true;
                    }
                }
            }
        };

        return {
            slideView,
            dialogVisible,
            cardList,
            pageNext,
            pagePrev,
            openCard
        };
    }
});
</script>

<style scoped lang="scss">
.view-box{
    :deep(.el-overlay){
        z-index: 999999 !important;
    }
    :deep(.el-dialog__body){
        height: 800px!important;
        width: 100%;
        overflow-y: auto;
    }
}
</style>
