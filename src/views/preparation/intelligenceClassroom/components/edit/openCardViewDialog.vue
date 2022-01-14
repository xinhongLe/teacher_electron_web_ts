<template>
    <div class="card-dialog"
    >
        <ScreenView
            ref="screenRef"
            :inline="true"
            :isInit="isInit"
            :writeBoardVisible="writeBoardVisible"
            @pagePrev="execPrev"
            @pageNext="execNext"
            @closeWriteBoard="closeWriteBoard"
            :slide="slideView"
        />
        <div class="cardLis-class">
                <div
                    class="me-page-item"
                    :class="selected === index && 'active'"
                    v-for="(item, index) in cardList"
                    @click="checkPage(index)"
                    :key="item.ID"
                >
                    {{ item.Name }}
                </div>
            </div>
            <Tools
                @prevStep="execPrev"
                @nextStep="execNext"
                @showWriteBoard="showWriteBoard"
                @hideWriteBoard="hideWriteBoard"
                @close="close"
                :isShowFullscreen="false"
                :isShowRemarkBtn="false"
                :isShowClose="true"
            />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import useHome from "@/hooks/useHome";
import { getWinCardDBData } from "@/utils/database";
import { ElMessage } from "element-plus";
import Tools from "../preview/tools.vue";
export default defineComponent({
    name: "openCardViewDia",
    props: {
        dialogVisible: {
            type: Boolean,
            require: true
        },
        cardList: {
            type: Array,
            default: () => []
        }
    },
    emits: ["closeOpenCard"],
    setup(props, { emit }) {
        const visible = computed(() => props.dialogVisible);
        const slideView = ref({});
        const cardList = ref<any[]>([]);
        const selected = ref(0);
        const isInit = ref(true);
        const writeBoardVisible = ref(false);
        const { getPageDetail } = useHome();
        onMounted(async () => {
            cardList.value = props.cardList;
            _getPageDetail(selected.value);
        });
        const execPrev = () => {
            if (selected.value === 0) {
                return ElMessage({ type: "warning", message: "已经是第一页" });
            }
            selected.value--;
            isInit.value = false;
            _getPageDetail(selected.value);
        };
        const execNext = () => {
            if (selected.value === cardList.value.length - 1) {
                return ElMessage({
                    type: "warning",
                    message: "已经是最后一页"
                });
            }
            selected.value++;
            isInit.value = true;
            _getPageDetail(selected.value);
        };
        const checkPage = async (index: number) => {
            selected.value = index;
            _getPageDetail(selected.value);
        };
        const _getPageDetail = async (index: number) => {
            const dbResArr = await getWinCardDBData(cardList.value[index].ID);
            if (dbResArr.length > 0) {
                slideView.value = JSON.parse(dbResArr[0].result);
            } else {
                await getPageDetail(cardList.value[index], 0, (res: any) => {
                    if (res && res.id) {
                        slideView.value = res;
                    }
                });
            }
        };
        const showWriteBoard = () => {
            writeBoardVisible.value = true;
        };
        const hideWriteBoard = () => {
            writeBoardVisible.value = false;
        };
        const closeWriteBoard = () => {
            writeBoardVisible.value = false;
        };
        const close = () => {
            emit("closeOpenCard");
        };
        return {
            visible,
            isInit,
            slideView,
            execPrev,
            execNext,
            selected,
            checkPage,
            showWriteBoard,
            hideWriteBoard,
            writeBoardVisible,
            closeWriteBoard,
            close
        };
    },
    components: { Tools }
});
</script>

<style scoped lang="scss">
.card-dialog {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    background: #fff;
    :deep(.me-tools-set) {
        transform: none;
    }
    :deep(.me-tools-steps) {
        flex: 0.5;
    }
}
.cardLis-class {
    display: flex;
    justify-content: flex-start;
    overflow-y: auto;
    padding: 10px 20px;
    .me-page-item {
        background-color: #f0f3ff;
        color: #444;
        padding: 10px 20px;
        box-sizing: border-box;
        text-align: center;
        font-size: 14px;
        white-space: nowrap;
        margin-right: 10px;
        border: 2px solid #f0f3ff;
        cursor: pointer;
        position: relative;
    }

    .me-page-item.active {
        border: 2px solid #6675f4;
    }
}
</style>
